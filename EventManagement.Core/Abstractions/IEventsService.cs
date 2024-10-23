using EventManagement.Core.Models;
using EventManagement.Core.ValueObjects;

namespace EventManagement.Core.Abstractions
{
    public interface IEventsService
    {
        Task<Guid> CreateEvent(Event @event);
        Task<Guid> DeleteEvent(Guid eventId);
        Task<List<Event>> GetAllEvents();
        Task<Guid> AddImages(Guid eventId, List<string> imageUrls);
        Task<Guid> UpdateEvent(Guid eventId, string title, string description, DateTime startDate, DateTime endDate, Location location, Guid organizerId, bool isActive);
    }
}