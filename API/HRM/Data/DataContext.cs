using HRM.Entities;
using Microsoft.EntityFrameworkCore;

namespace HRM.Data
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Employee> Employee { get; set; }
        public DbSet<Department> Department { get; set; }
        public DbSet<Evaluate> Evaluate { get; set; }
        public DbSet<OnLeave> OnLeave { get; set; }
        public DbSet<Payoff> Payoff { get; set; }
        public DbSet<Salary> Salary { get; set; }
        public DbSet<TimeKeeping> TimeKeeping { get; set; }
        public DbSet<TimeWorking> TimeWorking { get; set; }
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
        }
    }
}
