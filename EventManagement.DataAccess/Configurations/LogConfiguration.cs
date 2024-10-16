using EventManagement.Core.Models;
using EventManagement.DataAccess.Entities;
using EventManagement.DataAccess.Migrations;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EventManagement.DataAccess.Configurations
{
    class LogConfiguration : IEntityTypeConfiguration<LogEntry>
    {
        public void Configure(EntityTypeBuilder<LogEntry> builder)
        {
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Timestamp).HasDefaultValueSql("GETUTCDATE()");

            builder.Property(e => e.Action).IsRequired();

            builder.Property(e => e.ObjectId).IsRequired();
        }
    }
}
