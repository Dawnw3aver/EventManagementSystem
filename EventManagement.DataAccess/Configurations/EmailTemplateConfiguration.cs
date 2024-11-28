using EventManagement.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventManagement.DataAccess.Configurations
{
    public class EmailTemplateConfiguration : IEntityTypeConfiguration<EmailTemplateEntity>
    {
        public void Configure(EntityTypeBuilder<EmailTemplateEntity> builder)
        {
            builder.HasKey(e => e.Id);
            builder.Property(e => e.HtmlText)
                .IsRequired();
            builder.Property(e => e.Name)
                .IsRequired();
            builder.HasIndex(e => e.Name)
                .IsUnique();
        }
    }
}
