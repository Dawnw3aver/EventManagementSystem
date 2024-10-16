namespace EventManagement.Core.Abstractions
{
    public interface ILoggingService
    {
        Task LogActionAsync(string objectId, string action, string details);
    }
}