using EventManagement.API.Contracts;
using EventManagement.Core.Abstractions;
using EventManagement.Core.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EventManagement.API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class EventsController : ControllerBase
    {
        private readonly IEventsService _eventsService;
        
        public EventsController(IEventsService eventsService)
        {
            _eventsService = eventsService;
        }

        [Authorize]
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
            var (@event, error) = Event.Create(
                Guid.NewGuid(),
                request.title,
                request.description,
                request.startDate,
                request.endDate,
                request.location,
                request.organizerId,
                new List<Guid>(),
                DateTime.UtcNow,
                DateTime.UtcNow,
                request.isActive);

            if (!string.IsNullOrEmpty(error))
            {
                return BadRequest(error);
            }

            await _eventsService.CreateEvent(@event);

            return Ok(@event.Id);
        }

        [HttpPut("{id:guid}")]
        public async Task<ActionResult<Guid>> UpdateEvent(Guid id, [FromBody] EventsRequest request)
        {
            var eventId = await _eventsService.UpdateEvent(id, request.title, request.description, request.startDate, request.endDate, request.location, request.organizerId, request.isActive);
            return Ok(eventId);
        }

        [HttpDelete("{id:guid}")]
        public async Task<ActionResult<Guid>> DeleteEvent(Guid id)
        {
            var eventId = await _eventsService.DeleteEvent(id);
            return Ok(eventId);
        }
    }
}
