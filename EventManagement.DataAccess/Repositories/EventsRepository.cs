using EventManagement.Core.Abstractions;
using EventManagement.Core.Models;
using EventManagement.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventManagement.DataAccess.Repositories
{
    public class EventsRepository : IEventsRepository
    {
        private readonly EventManagementDbContext _context;
        public EventsRepository(EventManagementDbContext context)
        {
            _context = context;
        }

        public async Task<List<Event>> Get()
        {
            var eventEntities = await _context.Events.AsNoTracking().ToListAsync();

            var events = eventEntities
                .Select(e => Event.Create(e.Id, e.Title, e.Description, e.StartDate, e.EndDate, e.Location, e.OrganizerId, e.RegisteredParticipantIds, e.CreatedAt, e.UpdatedAt, e.IsActive).Event)
                .ToList();

            return events;
        }

        public async Task<Guid> Create(Event @event)
        {
            var eventEntity = new EventEntity
            {
                Id = @event.Id,
                Title = @event.Title,
                Description = @event.Description,
                StartDate = @event.StartDate,
                EndDate = @event.EndDate,
                Location = @event.Location,
                OrganizerId = @event.OrganizerId,
                RegisteredParticipantIds = @event.RegisteredParticipantIds,
                CreatedAt = @event.CreatedAt,
                UpdatedAt = @event.UpdatedAt,
                IsActive = @event.IsActive
            };

            await _context.Events.AddAsync(eventEntity);
            await _context.SaveChangesAsync();

            return eventEntity.Id;
        }

        public async Task<Guid> Update
          (Guid eventId,
          string title,
          string description,
          DateTime startDate,
          DateTime endDate,
          string location,
          Guid organizerId,
          bool isActive)
        {
            await _context.Events
                .Where(e => e.Id == eventId)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(e => e.Title, e => title)
                    .SetProperty(e => e.Description, e => description)
                    .SetProperty(e => e.StartDate, e => startDate)
                    .SetProperty(e => e.EndDate, e => endDate)
                    .SetProperty(e => e.Location, e => location)
                    .SetProperty(e => e.OrganizerId, e => organizerId)
                    .SetProperty(e => e.IsActive, e => isActive));

            return eventId;
        }

        public async Task<Guid> Delete(Guid eventId)
        {
            await _context.Events
                .Where(e => e.Id == eventId)
                .ExecuteDeleteAsync();

            return eventId;
        }
    }
}
