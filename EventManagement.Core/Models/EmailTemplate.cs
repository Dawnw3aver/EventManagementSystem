using CSharpFunctionalExtensions;

namespace EventManagement.Core.Models
{
    public class EmailTemplate
    {
        private EmailTemplate(Guid id, string name, string htmlText)
        {
            Name = name;
            HtmlText = htmlText;
        }
        public static Result<EmailTemplate> Create(Guid id, string name, string htmlText) //todo вадидация
        {
            var result = new EmailTemplate(id, name, htmlText);
            return Result.Success(result);
        }
        public Guid Id { get; }
        public string Name { get; }
        public string HtmlText { get; }
    }
}
