namespace EventManagement.DataAccess.Entities
{
    public class EmailTemplateEntity
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string HtmlText { get; set; }
    }
}
