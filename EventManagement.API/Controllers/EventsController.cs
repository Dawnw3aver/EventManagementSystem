using EventManagement.API.Contracts;
using EventManagement.Core.Abstractions;
using EventManagement.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using System.Security.Claims;

namespace EventManagement.API.Controllers
{
    [ApiController]
    [Authorize]
    [Route("api/v1/[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventsService _eventsService;
        private readonly ILoggingService _loggingService;
        private readonly ILocationService _locationService;
        private readonly IServiceProvider _serviceProvider;
        
        public EventsController(IEventsService eventsService, ILoggingService loggingService, ILocationService locationService, IServiceProvider serviceProvider)
        {
            _eventsService = eventsService;
            _loggingService = loggingService;
            _locationService = locationService;
            _serviceProvider = serviceProvider;

        }

        [HttpGet]
        public async Task<ActionResult<List<EventsResponse>>> GetEvents()
        {
            var events = await _eventsService.GetAllEvents();
            var usrManager = _serviceProvider.GetRequiredService<UserManager<User>>();
            var response = new List<EventsResponse>();

            foreach (var eventEntity in events) //todo мб оптимизировать
            {
                var participants = new List<string>();
                foreach (var participantId in eventEntity.RegisteredParticipantIds)
                {
                    var user = await usrManager.FindByIdAsync(participantId.ToString());
                    participants.Add(user?.UserName ?? "Unknown");
                }

                response.Add(new EventsResponse(
                    eventEntity.Id,
                    eventEntity.Title,
                    eventEntity.Description,
                    eventEntity.StartDate,
                    eventEntity.EndDate,
                    eventEntity.Location,
                    eventEntity.OrganizerId,
                    participants,
                    eventEntity.IsActive,
                    eventEntity.CreatedAt,
                    eventEntity.UpdatedAt,
                    eventEntity.ImageUrls
                ));
            }

            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateEvent([FromBody]EventsRequest request)
        {
            var authorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var loc = await _locationService.CreateLocation(request.location);
            if (loc.IsFailure)
                return BadRequest(loc.Error);

            var (@event, error) = Event.Create(
                Guid.NewGuid(),
                request.title,
                request.description,
                request.startDate,
                request.endDate,
                loc.Value,
                new Guid(authorId),
                new List<Guid>(),
                new List<string>(),
                DateTime.UtcNow,
                DateTime.UtcNow,
                request.isActive);

            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            var id = await _eventsService.CreateEvent(@event);
            await _loggingService.LogActionAsync(id.ToString(), "CreateEvent", $"Создано событие {request.title}");

            return Ok(@event.Id);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Guid>> UpdateEvent(Guid id, [FromBody] EventsRequest request) //todo убрать автора
        {
            var authorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var loc = await _locationService.CreateLocation(request.location);
            if (loc.IsFailure)
                return BadRequest(loc.Error);
            var eventId = await _eventsService.UpdateEvent(id, request.title, request.description, request.startDate, request.endDate, loc.Value, new Guid(authorId), request.isActive);
            await _loggingService.LogActionAsync(id.ToString(), "UpdateEvent", $"Обновлено событие {request.title}");
            return Ok(eventId);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteEvent(Guid id)
        {
            var eventId = await _eventsService.DeleteEvent(id);
            await _loggingService.LogActionAsync(id.ToString(), "DeleteEvent", $"Событие удалено");

            try
            {
                Directory.Delete(Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", id.ToString()), true);
            }
            catch (DirectoryNotFoundException ex) { }

            return Ok(eventId);
        }

        [HttpPost("upload-images")]
        public async Task<IActionResult> UploadImages(Guid id, IFormFileCollection files) //todo проверить, что грузят именно изображения, ограничить количество
        {
            if (!files.Any())
                return BadRequest();

            var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads", id.ToString());

            if (!Directory.Exists(uploadsPath))
            {
                Directory.CreateDirectory(uploadsPath);
            }

            var imageUrls = new List<string>();

            foreach (var file in files)
            {
                if (file.Length > 0)
                {
                    var fileName = Guid.NewGuid() + Path.GetExtension(file.FileName);
                    var filePath = Path.Combine(uploadsPath, fileName);

                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    var imageUrl = $"/uploads/{id}/{fileName}";
                    imageUrls.Add(imageUrl);
                }
            }

            await _eventsService.AddImages(id, imageUrls);

            return Ok(new { ImageUrls = imageUrls });
        }

        [HttpPost("join")]
        public async Task<ActionResult> JoinEvent([FromQuery]Guid eventId)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            var usrManager = _serviceProvider.GetRequiredService<UserManager<User>>();
            User user = await usrManager.FindByIdAsync(userId);

            var result = await _eventsService.JoinEvent(eventId, user);
            if (result.IsFailure)
                return BadRequest(result.Error);

            return Ok();
        }
    }
}
