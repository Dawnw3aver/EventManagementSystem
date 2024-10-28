using EventManagement.Core.Abstractions;
using System.Net.Mail;

namespace EventManagement.Application.Services
{
    public class EmailService : IEmailService
    {
        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            SmtpClient client = new SmtpClient
            {
                Host = "localhost",
                Port = 1025, // Порт MailHog
                EnableSsl = false,
                DeliveryMethod = SmtpDeliveryMethod.Network,
                UseDefaultCredentials = true,
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress("support@eventify.com"),
                Subject = subject,
                Body = htmlMessage,
                IsBodyHtml = true
            };

            mailMessage.To.Add(email);

            return client.SendMailAsync(mailMessage);
        }
    }
}
