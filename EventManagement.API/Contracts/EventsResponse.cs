namespace EventManagement.API.Contracts
{
    public record EventsResponse
        (Guid eventId, 
        string title, 
        string description, 
        DateTime startDate,
        DateTime endDate, 
        string location, 
        Guid organizerId,
        bool isActive,
        DateTime createdAt,
        DateTime updatedAt);
}
