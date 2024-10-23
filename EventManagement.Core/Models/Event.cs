using EventManagement.Core.ValueObjects;
using System.Text;

namespace EventManagement.Core.Models
{
    /// <summary>
    /// Объектная модель события
    /// </summary>
    public class Event
    {
        public const int MAX_TITLE_LENGTH = 250;
        public const int MAX_DESCRIPTION_LENGTH = 1000;
        public const int MAX_LOCATION_LENGTH = 250;

        private Event(Guid id, 
            string title, 
            string description, 
            DateTime startDate, 
            DateTime endDate, 
            Location location, 
            Guid organizerId, 
            List<Guid> registeredParticipantIds,
            List<string> imageUrls,
            DateTime createdAt,
            DateTime updatedAt,
            bool isActive)
        {
            Id = id;
            Title = title;
            Description = description;
            StartDate = startDate;
            EndDate = endDate;
            Location = location;
            OrganizerId = organizerId;
            RegisteredParticipantIds = registeredParticipantIds;
            ImageUrls = imageUrls;
            CreatedAt = createdAt;
            UpdatedAt = updatedAt;
            IsActive = isActive;
        }

        public static (Event Event, string Error) Create(Guid id,
          string title,
          string description,
          DateTime startDate,
          DateTime endDate,
          Location location,
          Guid organizerId,
          List<Guid> registeredParticipantIds,
          List<string> imageUrls,
          DateTime createdAt,
          DateTime updatedAt,
          bool isActive)
        {
            StringBuilder error = new StringBuilder();
            if (string.IsNullOrWhiteSpace(title) || title.Length > MAX_TITLE_LENGTH)
            {
                error.AppendLine($"Title can't be empty or longer than {MAX_TITLE_LENGTH} symbols.");
            }

            if (string.IsNullOrWhiteSpace(description) || description.Length > MAX_DESCRIPTION_LENGTH)
            {
                error.AppendLine($"Description can't be empty or longer than {MAX_DESCRIPTION_LENGTH} symbols.");
            }

            // Валидация дат начала и окончания мероприятия
            if (startDate <= DateTime.UtcNow)
            {
                error.AppendLine("Start date must be in the future.");
            }
            if (endDate <= startDate)
            {
                error.AppendLine("End date must be after the start date.");
            }

            // Валидация организатора
            if (organizerId == Guid.Empty)
            {
                error.AppendLine("Organizer ID must be provided.");
            }

            // Валидация зарегистрированных участников
            if (registeredParticipantIds == null)
            {
                error.AppendLine("Registered participants list cannot be null.");
            }

            Event newEvent = new(id, title, description, startDate, endDate, location, organizerId, registeredParticipantIds, imageUrls, createdAt, updatedAt, isActive);
            return (newEvent, error.ToString());
        }

        public Guid Id { get; }

        public string Title { get; } = string.Empty;

        public string Description { get; } = string.Empty;

        public DateTime StartDate { get; }

        public DateTime EndDate { get; }

        public Location Location { get; }

        public Guid OrganizerId { get;}

        public List<Guid> RegisteredParticipantIds { get; } = [];

        public List<string> ImageUrls { get; } = [];

        public DateTime CreatedAt { get; } = DateTime.UtcNow;

        public DateTime UpdatedAt { get; }

        public bool IsActive { get; }
    }
}
