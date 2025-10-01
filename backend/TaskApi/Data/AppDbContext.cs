using Microsoft.EntityFrameworkCore;
using TaskApi.Models;

namespace TaskApi.Data
{
    //AppDbContext: The EF Core gateway to your database (acts as the bridge from code to database)
    public class AppDbContext : DbContext
    {
        // this constructor lets ASP.NET inject options (like the connection string)
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=TaskLearningDb;Trusted_Connection=True;");
            return new AppDbContext(optionsBuilder.Options);
        }

        // DbSet<T> maps your model to a table (TaskItem -> Tasks) (specifically map/bridges the TaskItem class to tasks table in db)
        public DbSet<TaskItem> Tasks => Set<TaskItem>();
    }
}