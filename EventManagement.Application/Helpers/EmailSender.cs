using Microsoft.AspNetCore.Identity.UI.Services;
using System.Net.Mail;
using System.Net;
using Microsoft.AspNetCore.Identity;
using EventManagement.Core.Abstractions;

namespace EventManagement.Application.Helpers
{
    public class EmailSender<TUser>() : IEmailSender<TUser> where TUser : class
    {
        public Task SendConfirmationLinkAsync(TUser user, string email, string confirmationLink) =>
            SendEmailAsync(email, "Confirm your email", $"Please confirm your account by <a href='{confirmationLink}'>clicking here</a>.");

        public Task SendPasswordResetLinkAsync(TUser user, string email, string resetLink) =>
            SendEmailAsync(email, "Reset your password", $"Please reset your password by <a href='{resetLink}'>clicking here</a>.");

        public Task SendPasswordResetCodeAsync(TUser user, string email, string resetCode) =>
           SendEmailAsync(email, "Reset your password", $"Please reset your password using the following code: {resetCode}");

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
