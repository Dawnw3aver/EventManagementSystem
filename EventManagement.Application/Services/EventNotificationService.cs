using EventManagement.Application.Helpers;
using EventManagement.Core.Abstractions;
using EventManagement.Core.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System.Text;

namespace EventManagement.Application.Services
{
    public class EventNotificationService : BackgroundService
    {
        private readonly IServiceScopeFactory _serviceScopeFactory;
        private readonly Dictionary<Guid, DateTime> _sentNotifications = [];

        public EventNotificationService(IServiceScopeFactory serviceScopeFactory)
        {
            _serviceScopeFactory = serviceScopeFactory;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            while (!stoppingToken.IsCancellationRequested)
            {
                ClearNotificationQueue();
                await NotifyUpcomingEvents(stoppingToken);
                await NotifyRecentlyUpdatedEvents(stoppingToken);
                await Task.Delay(TimeSpan.FromMinutes(30), stoppingToken);
            }
        }

        private async Task NotifyEvents(
            Func<Event, bool> eventFilter,
            Func<Event, string> createTitle,
            Func<Event, Task<string>> createMessage,
            CancellationToken stoppingToken)
        {
            using var scope = _serviceScopeFactory.CreateScope();
            var eventsRepository = scope.ServiceProvider.GetRequiredService<IEventsRepository>();
            var emailService = scope.ServiceProvider.GetRequiredService<IEmailService>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();


            var events = (await eventsRepository.Get())
                .Where(eventFilter)
                .ToList();

            var tasks = new List<Task>();

            foreach (var eventInfo in events)
            {
                if (_sentNotifications.ContainsKey(eventInfo.Id))
                    continue;
                var participantIds = eventInfo.RegisteredParticipantIds.Select(id => id.ToString()).ToList();
                var participants = await userManager.Users
                    .Where(u => participantIds.Contains(u.Id))
                    .ToListAsync(stoppingToken);

                var title = createTitle(eventInfo);
                var message = await createMessage(eventInfo);

                tasks.AddRange(participants
                    .Select(user => emailService.SendEmailAsync(user.Email, title, message)));
                _sentNotifications.Add(eventInfo.Id, DateTime.Now);
            }
            await Task.WhenAll(tasks);
        }

        private async Task NotifyUpcomingEvents(CancellationToken stoppingToken)
        {
            
            await NotifyEvents(
                e => (e.StartDate - DateTime.Now).TotalHours <= 24 && e.EndDate > DateTime.Now,
                eventInfo => $"Скоро начнется событие {eventInfo.Title}",
                async eventInfo =>
                {
                    var placeholders = new Dictionary<string, string> 
                    {
                        { "eventTitle", $"{eventInfo.Title}" },
                        { "eventDate", $"{eventInfo.StartDate} - {eventInfo.EndDate}" },
                        { "eventLocation", $"{eventInfo.Location.Address}" },
                        { "eventDescription", $"{eventInfo.Description}" },
                        { "eventLink", $"http://eventify.ddns.net/event?eventId={eventInfo.Id}" },
                        { "unsubscribeLink", "http://example.com/unsubscribe" }
                    };
                    var emailService = _serviceScopeFactory.CreateScope()
                        .ServiceProvider.GetRequiredService<IEmailService>();
                    return await emailService.CreateEmailMessage("StartSoonTemplate", placeholders);
                },
                stoppingToken
            );
        }

        private async Task NotifyRecentlyUpdatedEvents(CancellationToken stoppingToken)
        {
            await NotifyEvents(
                e => (DateTime.Now - e.UpdatedAt).TotalMinutes <= 30,
                eventInfo => $"Обновлено событие {eventInfo.Title}",
                async eventInfo =>
                {
                    var placeholders = new Dictionary<string, string>
                    {
                        { "eventTitle", $"{eventInfo.Title}" },
                        { "eventDate", $"{eventInfo.StartDate} - {eventInfo.EndDate}" },
                        { "eventLocation", $"{eventInfo.Location.Address}" },
                        { "eventDescription", $"{eventInfo.Description}" },
                        { "eventLink", "http://example.com/event/12345" },
                        { "unsubscribeLink", "http://example.com/unsubscribe" }
                    };
                    var emailService = _serviceScopeFactory.CreateScope()
                        .ServiceProvider.GetRequiredService<IEmailService>();
                    return await emailService.CreateEmailMessage("StartSoonTemplate", placeholders);
                },
                stoppingToken
            );
        }

        private void ClearNotificationQueue() //todo очередь не должна пропадать после перезапуска
        {
            var keysToRemove = _sentNotifications
             .Where(kvp => (DateTime.Now - kvp.Value).TotalHours > 24)
             .Select(kvp => kvp.Key)
             .ToList();

            foreach (var key in keysToRemove)
            {
                _sentNotifications.Remove(key);
            }
        }
    }
}
