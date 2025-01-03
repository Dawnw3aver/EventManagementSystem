﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using EventManagement.API.Contracts;
using EventManagement.Core.Models;
using EventManagement.Core.Abstractions;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using EventManagement.Core.Enums;

namespace EventManagement.API.Controllers
{
    [ApiController]
    [Authorize(Roles = "Admin")]
    [Route("api/v1/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly ILoggingService _loggingService;
        private readonly IServiceProvider _serviceProvider;
        private static readonly EmailAddressAttribute _emailAddressAttribute = new();

        public UsersController(UserManager<User> userManager, 
            RoleManager<IdentityRole> roleManager, 
            ILoggingService loggingService, 
            IServiceProvider serviceProvider)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _loggingService = loggingService;
            _serviceProvider = serviceProvider;
        }

        [HttpGet]
        public async Task<ActionResult<List<UsersResponse>>> GetUsers()
        {
            var users = _userManager.Users.ToList();
            var response = new List<UsersResponse>();

            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                response.Add(new UsersResponse(
                    Guid.Parse(user.Id),
                    user.Email,
                    user.UserName,
                    user.PhoneNumber,
                    user.FirstName,
                    user.MiddleName,
                    user.LastName,
                    user.BirthDate,
                    roles.ToList()
                ));
            }
            return Ok(response);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<List<UsersResponse>>> GetUser(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
                return NotFound();

            var roles = await _userManager.GetRolesAsync(user);
            var response = new UsersResponse(
                    Guid.Parse(user.Id),
                    user.Email,
                    user.UserName,
                    user.PhoneNumber,
                    user.FirstName,
                    user.MiddleName,
                    user.LastName,
                    user.BirthDate,
                    roles.ToList()
                );
            return Ok(response);
        }

        [Authorize(Roles = "Admin,User")]
        [HttpGet("current")]
        public async Task<ActionResult<List<UsersResponse>>> GetCurrentUser()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var user = await _userManager.FindByIdAsync(currentUserId);

            var roles = await _userManager.GetRolesAsync(user);
            var response = new UsersResponse(
                    Guid.Parse(user.Id),
                    user.Email,
                    user.UserName,
                    user.PhoneNumber,
                    user.FirstName,
                    user.MiddleName,
                    user.LastName,
                    user.BirthDate,
                    roles.ToList()
                );
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateUser([FromBody] UsersRequest request)
        {
            var userStore = _serviceProvider.GetRequiredService<IUserStore<User>>();
            var emailStore = (IUserEmailStore<User>)userStore;
            var email = request.Email;
            if (string.IsNullOrEmpty(email) || !_emailAddressAttribute.IsValid(email))
            {
                return BadRequest("Invalid email");
            }

            var user = new User
            {
                Email = request.Email,
                UserName = request.UserName,
                PhoneNumber = request.PhoneNumber,
                FirstName = request.FirstName,
                MiddleName = request.MiddleName,
                LastName = request.LastName,
                BirthDate = request.BirthDate
            };

            await userStore.SetUserNameAsync(user, user.Email, CancellationToken.None);
            await emailStore.SetEmailAsync(user, user.Email, CancellationToken.None);

            var result = await _userManager.CreateAsync(user, request.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            foreach (var role in request.Roles)
            {
                if (await _roleManager.RoleExistsAsync(role))
                {
                    await _userManager.AddToRoleAsync(user, role);
                }
            }

            await _loggingService.LogActionAsync(user.Id, "CreateUser", $"Создан пользователь \"{user.UserName}\"");
            return Ok(Guid.Parse(user.Id));
        }

        [Authorize(Roles = "Admin,User")]
        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Guid>> UpdateUser(Guid id, [FromBody] UserUpdateRequest request)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            user.Email = request.Email ?? user.Email;
            user.UserName = request.UserName ?? user.UserName;
            user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
            user.FirstName = request.FirstName ?? user.FirstName;
            user.MiddleName = request.MiddleName ?? user.MiddleName;
            user.LastName = request.LastName ?? user.LastName;
            user.BirthDate = request.BirthDate ?? user.BirthDate;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            var currentRoles = await _userManager.GetRolesAsync(user);
            await _userManager.RemoveFromRolesAsync(user, currentRoles);
            foreach (var role in request.Roles)
            {
                if (await _roleManager.RoleExistsAsync(role))
                {
                    await _userManager.AddToRoleAsync(user, role);
                }
            }

            await _loggingService.LogActionAsync(user.Id, "UpdateUser", $"Обновлен пользователь \"{user.UserName}\"");
            return Ok(Guid.Parse(user.Id));
        }

        [Authorize(Roles = "Admin,User")]
        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteUser(Guid id)
        {
            var user = await _userManager.FindByIdAsync(id.ToString());
            if (user == null)
            {
                return NotFound();
            }

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            await _loggingService.LogActionAsync(user.Id, "UpdateUser", $"Удален пользователь \"{user.UserName}\"");
            return Ok(id);
        }
    }
}