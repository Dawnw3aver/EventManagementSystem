using EventManagement.Core.Models;
using EventManagement.Core.ValueObjects;
using EventManagement.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Linq;

namespace EventManagement.DataAccess.Configurations
{
    public class EventConfiguration : IEntityTypeConfiguration<EventEntity>
    {
        public void Configure(EntityTypeBuilder<EventEntity> builder)
        {
            builder.HasKey(e => e.Id);

            builder.Property(e => e.Title)
                .IsRequired()
                .HasMaxLength(Event.MAX_TITLE_LENGTH);

            // Настройка поля Description
            builder.Property(e => e.Description)
                .IsRequired()
                .HasMaxLength(Event.MAX_DESCRIPTION_LENGTH); // Предполагаем, что MAX_DESCRIPTION_LENGTH также определено в модели

            // Настройка поля StartDate
            builder.Property(e => e.StartDate)
                .IsRequired(); // Дата начала мероприятия обязательна

            // Настройка поля EndDate
            builder.Property(e => e.EndDate)
                .IsRequired(); // Дата окончания мероприятия обязательна

            // Настройка поля OrganizerId
            builder.Property(e => e.OrganizerId)
                .IsRequired(); // Организатор обязателен

            // Настройка поля CreatedAt
            builder.Property(e => e.CreatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()"); // Значение по умолчанию — текущая дата и время в формате UTC

            // Настройка поля UpdatedAt
            builder.Property(e => e.UpdatedAt)
                .IsRequired()
                .HasDefaultValueSql("GETUTCDATE()") // Значение по умолчанию — текущая дата и время в формате UTC
                .ValueGeneratedOnAddOrUpdate(); // Автоматически обновляется при изменении

            // Настройка поля IsActive
            builder.Property(e => e.IsActive)
                .IsRequired()
                .HasDefaultValue(true);
        }
    }
}
