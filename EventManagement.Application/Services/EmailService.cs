using EventManagement.Core.Abstractions;
using MimeKit;
using MailKit.Net.Smtp;

namespace EventManagement.Application.Services
{
    public class EmailService : IEmailService
    {
        public async Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            try
            {
                var message = new MimeMessage();
                message.From.Add(new MailboxAddress("Eventify Support", "MS_9Q0cf6@trial-v69oxl5n3jkl785k.mlsender.net"));
                message.To.Add(new MailboxAddress("", email));
                message.Subject = subject;
                message.Body = new TextPart("html")
                {
                    Text = htmlMessage
                };

                using var client = new SmtpClient();
                await client.ConnectAsync("smtp.mailersend.net", 587, MailKit.Security.SecureSocketOptions.StartTls);
                await client.AuthenticateAsync("MS_9Q0cf6@trial-v69oxl5n3jkl785k.mlsender.net", "FBpz6P6ArQELGBbR");
                await client.SendAsync(message);
                await client.DisconnectAsync(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message + '\n' + ex.StackTrace);
                Console.WriteLine($"email: {email}, subjest: {subject}, message: {htmlMessage}");
            }
        }
    }
}
