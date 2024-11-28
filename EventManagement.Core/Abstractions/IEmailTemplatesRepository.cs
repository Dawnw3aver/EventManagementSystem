using EventManagement.Core.Models;

namespace EventManagement.Core.Abstractions
{
    public interface IEmailTemplatesRepository
    {
        Task<Guid> Create(string name, string htmlText);
        Task<Guid> Delete(Guid id);
        Task<List<EmailTemplate>> Get();
        Task<EmailTemplate> GetByName(string name);
        Task<Guid> Update(Guid id, string name, string htmlText);
    }
}