namespace EventManagement.Core.Models
{
    public class LogEntry
    {
        public Guid Id { get; set; }
        public required string ObjectId { get; set; } // Идентификатор пользователя, совершившего действие
        public required string Action { get; set; } // Тип действия (например, создание, изменение, удаление)
        public string? Details { get; set; } // Дополнительная информация о действии
        public DateTime Timestamp { get; set; } = DateTime.UtcNow; // Время события
    }
}
