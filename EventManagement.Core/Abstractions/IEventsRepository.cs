using EventManagement.Core.Models;
using EventManagement.Core.ValueObjects;

namespace EventManagement.Core.Abstractions
{
    public interface IEventsRepository
    {
        Task<Guid> Create(Event @event);
        Task<Guid> Delete(Guid eventId);
        Task<Guid> AddImages(Guid eventId, List<string> imageUrls);
        Task<List<Event>> Get();
        Task<Guid> Update(Guid eventId, string title, string description, DateTime startDate, DateTime endDate, Location location, Guid organizerId, bool isActive);
    }
}