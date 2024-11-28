using EventManagement.Core.ValueObjects;

namespace EventManagement.API.Contracts
{
    public record EventsResponse
        (Guid id, 
        string title, 
        string description, 
        DateTime startDate,
        DateTime endDate, 
        Location location, 
        Guid organizerId,
        List<string> participants,
        bool isActive,
        DateTime createdAt,
        DateTime updatedAt,
        List<string> imageUrls);
}
