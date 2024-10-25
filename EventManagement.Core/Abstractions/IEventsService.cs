using CSharpFunctionalExtensions;
using EventManagement.Core.Models;
using EventManagement.Core.ValueObjects;

namespace EventManagement.Core.Abstractions
{
    public interface IEventsService
    {
        Task<Guid> CreateEvent(Event @event);
        Task<Guid> DeleteEvent(Guid eventId);
        Task<List<Event>> GetAllEvents();
        Task<Result> AddImages(Guid eventId, List<string> imageUrls);
        Task<Result> JoinEvent(Guid eventId, User user);
        Task<Guid> UpdateEvent(Guid eventId, string title, string description, DateTime startDate, DateTime endDate, Location location, bool isActive);
        Task<bool> IsAuthor(Guid eventId, User user);
    }
}