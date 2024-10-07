using EventManagement.DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace EventManagement.DataAccess
{
    public class EventManagementDbContext : DbContext
    {
        public EventManagementDbContext(DbContextOptions<EventManagementDbContext> options) : base(options)
        {
            
        }

        public DbSet<EventEntity> Events { get; set; }
    }
}
