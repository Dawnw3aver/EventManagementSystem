using CSharpFunctionalExtensions;
using EventManagement.Core.Abstractions;
using EventManagement.Core.Models;
using EventManagement.Core.ValueObjects;
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
                .Select(e => Event.Create(e.Id, e.Title, e.Description, e.StartDate, e.EndDate, e.Location, e.OrganizerId, e.RegisteredParticipantIds, e.ImageUrls, e.CreatedAt, e.UpdatedAt, e.IsActive).Event)
                .ToList();

            return events;
        }

        public async Task<Result<Event>> GetById(Guid eventId)
        {
            var e = await _context.Events.FindAsync(eventId);
            if (e == null)
                return Result.Failure<Event>("Event not found");
            else
                return Result.Success(Event.Create(e.Id, e.Title, e.Description, e.StartDate, e.EndDate, e.Location, e.OrganizerId, e.RegisteredParticipantIds, e.ImageUrls, e.CreatedAt, e.UpdatedAt, e.IsActive).Event);
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
          Location location,
          bool isActive)
        {
            await _context.Events
                .Where(e => e.Id == eventId)
                .ExecuteUpdateAsync(x => x
                    .SetProperty(e => e.Title, e => title)
                    .SetProperty(e => e.Description, e => description)
                    .SetProperty(e => e.StartDate, e => startDate)
                    .SetProperty(e => e.EndDate, e => endDate)
                    .SetProperty(e => e.Location.Address, e => location.Address)
                    .SetProperty(e => e.Location.City, e => location.City)
                    .SetProperty(e => e.Location.Country, e => location.Country)
                    .SetProperty(e => e.Location.Latitude, e => location.Latitude)
                    .SetProperty(e => e.Location.Longitude, e => location.Longitude)
                    .SetProperty(e => e.IsActive, e => isActive)
                    .SetProperty(e => e.UpdatedAt, e => DateTime.UtcNow));

            return eventId;
        }

        public async Task<Guid> Delete(Guid eventId)
        {
            await _context.Events
                .Where(e => e.Id == eventId)
                .ExecuteDeleteAsync();

            return eventId;
        }

        public async Task<Result> AddImages(Guid eventId, List<string> imageUrls)
        {
            // Найти событие по его Id
            var eventEntity = await _context.Events.FindAsync(eventId);
            if(eventEntity == null)
                return Result.Failure($"Event with ID {eventId} not found.");
            eventEntity.ImageUrls.AddRange(imageUrls);

            // Сохранить изменения в базе данных
            await _context.SaveChangesAsync();

            return Result.Success();
        }

        public async Task<Result> Join(Guid eventId, User user)
        {
            var @event = await _context.Events.FindAsync(eventId);
            if(@event == null)
                return Result.Failure($"Event with ID {eventId} not found.");

            if (@event.RegisteredParticipantIds.Contains(new Guid(user.Id)))
            {
                return Result.Failure("User is already registered for the event");
            }

            @event.RegisteredParticipantIds.Add(new Guid(user.Id));

            await _context.SaveChangesAsync();

            return Result.Success("User successfully joined the event");
        }

        public async Task<Result> Leave(Guid eventId, User user)
        {
            var @event = await _context.Events.FindAsync(eventId);
            if (@event == null)
                return Result.Failure($"Event with ID {eventId} not found.");

            if (!@event.RegisteredParticipantIds.Contains(new Guid(user.Id)))
            {
                return Result.Failure("User is not registered for the event");
            }

            @event.RegisteredParticipantIds.Remove(new Guid(user.Id));

            await _context.SaveChangesAsync();

            return Result.Success("User successfully left the event");
        }
    }
}
