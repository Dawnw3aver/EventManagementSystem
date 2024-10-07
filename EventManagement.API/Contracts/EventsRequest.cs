namespace EventManagement.API.Contracts
{
    public record EventsRequest
        (string title,
        string description,
        DateTime startDate,
        DateTime endDate,
        string location,
        Guid organizerId,
        bool isActive);
}
