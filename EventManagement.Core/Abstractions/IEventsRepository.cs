using EventManagement.Core.Models;

namespace EventManagement.Core.Abstractions
{
    public interface IEventsRepository
    {
        Task<Guid> Create(Event @event);
        Task<Guid> Delete(Guid eventId);
        Task<Guid> AddImages(Guid eventId, List<string> imageUrls);
        Task<List<Event>> Get();
        Task<Guid> Update(Guid eventId, string title, string description, DateTime startDate, DateTime endDate, string location, Guid organizerId, bool isActive);
    }
}