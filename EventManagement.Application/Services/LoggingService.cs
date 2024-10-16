using EventManagement.Core.Models;
using EventManagement.DataAccess;
using EventManagement.Core.Abstractions;

namespace EventManagement.Application.Services
{
    public class LoggingService : ILoggingService
    {
        private readonly EventManagementDbContext _context;

        public LoggingService(EventManagementDbContext context)
        {
            _context = context;
        }

        public async Task LogActionAsync(string objectId, string action, string details)
        {
            var logEntry = new LogEntry
            {
                Id = Guid.NewGuid(),
                ObjectId = objectId,
                Action = action,
                Details = details
            };

            _context.LogEntries.Add(logEntry);
            await _context.SaveChangesAsync();
        }
    }
}
