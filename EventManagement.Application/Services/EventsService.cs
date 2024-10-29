using CSharpFunctionalExtensions;
using EventManagement.Core.Abstractions;
using EventManagement.Core.Models;
using EventManagement.Core.ValueObjects;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace EventManagement.Application.Services
{
    public class EventsService : IEventsService
    {
        private readonly IEventsRepository _eventsRepository;
        public EventsService(IEventsRepository eventsRepository)
        {
            _eventsRepository = eventsRepository;
        }

        public async Task<List<Event>> GetAllEvents()
        {
            return await _eventsRepository.Get();
        }

        public async Task<Guid> CreateEvent(Event @event)
        {
            return await _eventsRepository.Create(@event);
        }

        public async Task<Guid> UpdateEvent(Guid eventId, string title, string description, DateTime startDate, DateTime endDate, Location location, bool isActive)
        {
            return await _eventsRepository.Update(eventId, title, description, startDate, endDate, location, isActive);
        }

        public async Task<Guid> DeleteEvent(Guid eventId)
        {
            return await _eventsRepository.Delete(eventId);
        }

        public async Task<Result> AddImages(Guid eventId, List<string> imageUrls)
        {
            return await _eventsRepository.AddImages(eventId, imageUrls);
        }

        public async Task<Result> JoinEvent(Guid eventId, User user)
        {
            return await _eventsRepository.Join(eventId, user);
        }
        public async Task<Result> LeaveEvent(Guid eventId, User user)
        {
            return await _eventsRepository.Leave(eventId, user);
        }

        public async Task<bool> IsAuthor(Guid eventId, User user)
        {
            var res = await _eventsRepository.GetById(eventId);
            var @event = res.Value;
            Guid userId = new(user.Id);
            return userId == @event.OrganizerId;
        }
    }
}
