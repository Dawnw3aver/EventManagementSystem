using EventManagement.API.Contracts;
using EventManagement.Core.Abstractions;
using EventManagement.Core.Models;
using Microsoft.AspNetCore.Authorization;
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
        
        public EventsController(IEventsService eventsService, ILoggingService loggingService)
        {
            _eventsService = eventsService;
            _loggingService = loggingService;
        }

        [HttpGet]
        public async Task<ActionResult<List<EventsResponse>>> GetEvents()
        {
            var events = await _eventsService.GetAllEvents();
            var response = events.Select(x => new EventsResponse(x.Id, x.Title, x.Description, x.StartDate, x.EndDate, x.Location, x.OrganizerId, x.IsActive, x.CreatedAt, x.UpdatedAt, x.ImageUrls));
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<Guid>> CreateEvent([FromBody]EventsRequest request)
        {
            var authorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var (@event, error) = Event.Create(
                Guid.NewGuid(),
                request.title,
                request.description,
                request.startDate,
                request.endDate,
                request.location,
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
        public async Task<ActionResult<Guid>> UpdateEvent(Guid id, [FromBody] EventsRequest request)
        {
            var authorId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var eventId = await _eventsService.UpdateEvent(id, request.title, request.description, request.startDate, request.endDate, request.location, new Guid(authorId), request.isActive);
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

        [HttpPost("/upload-images")]
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
    }
}
