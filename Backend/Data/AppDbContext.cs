using Microsoft.EntityFrameworkCore;
using SquirrelsBackend.Models;

namespace SquirrelsBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Squirrel> Squirrels { get; set; }
        public DbSet<UserSquirrel> UserSquirrels { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<UserSquirrel>().HasKey(ui => new { ui.UserId, ui.SquirrelId });
        }
        public DbSet<Siska> Sisky { get; set; }
    }
}
