﻿namespace EventManagement.Core.Abstractions
{
    public interface IEmailService
    {
        Task SendEmailAsync(string email, string subject, string htmlMessage);
        Task<string> CreateEmailMessage(string templateName, Dictionary<string, string> placeholders);
    }
}
