using EventManagement.Core.Models;
using EventManagement.DataAccess.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EventManagement.DataAccess
{
    public class EventManagementDbContext : IdentityDbContext<User>
    {
        public EventManagementDbContext(DbContextOptions<EventManagementDbContext> options) : base(options)
        {
            
        }

        public DbSet<EventEntity> Events { get; set; }
    }
}
