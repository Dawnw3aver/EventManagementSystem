using EventManagement.API.Contracts;
using EventManagement.Core.Abstractions;
using EventManagement.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
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
            var response = events.Select(x => new EventsResponse(x.Id, x.Title, x.Description, x.StartDate, x.EndDate, x.Location, x.OrganizerId, x.IsActive, x.CreatedAt, x.UpdatedAt));
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
            return Ok(eventId);
        }
    }
}
