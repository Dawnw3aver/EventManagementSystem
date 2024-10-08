namespace EventManagement.DataAccess.Entities
{
    public class EventEntity
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;

        public DateTime StartDate { get; set; }

        public DateTime EndDate { get; set; }

        public string Location { get; set; } = string.Empty;

        public Guid OrganizerId { get; set; }

        public List<Guid> RegisteredParticipantIds { get; set; } = [];

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; set; }

        public bool IsActive { get; set; }
    }
}
