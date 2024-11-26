using CSharpFunctionalExtensions;
using EventManagement.Core.Abstractions;
using EventManagement.Core.Models;
using EventManagement.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace EventManagement.DataAccess.Repositories
{
    public class EmailTemplatesRepository : IEmailTemplatesRepository
    {
        private readonly EventManagementDbContext _context;
        public EmailTemplatesRepository(EventManagementDbContext context)
        {
            _context = context;
        }

        public async Task<List<EmailTemplate>> Get()
        {
            var templates = await _context.EmailTemplates.AsNoTracking().ToListAsync();
            return templates.Select(x => EmailTemplate.Create(x.Id, x.Name, x.HtmlText).Value).ToList();
        }

        public async Task<EmailTemplate> GetByName(string name)
        {
            var template = _context.EmailTemplates.First(x => x.Name == name);
            return EmailTemplate.Create(template.Id, template.Name, template.HtmlText).Value;
        }

        public async Task<Guid> Update(Guid id, string name, string htmlText)
        {
            await _context.EmailTemplates.Where(x => x.Id == id)
                .ExecuteUpdateAsync(x => x
                .SetProperty(e => e.Name, e => name)
                .SetProperty(e => e.HtmlText, e => htmlText));
            return id;
        }

        public async Task<Guid> Delete(Guid id)
        {
            await _context.EmailTemplates
                 .Where(e => e.Id == id)
                 .ExecuteDeleteAsync();

            return id;
        }

        public async Task<Guid> Create(string name, string htmlText)
        {
            var template = new EmailTemplateEntity { Id = Guid.NewGuid(), Name = name, HtmlText = htmlText };
            await _context.EmailTemplates.AddAsync(template);
            await _context.SaveChangesAsync();
            return template.Id;
        }
    }
}
