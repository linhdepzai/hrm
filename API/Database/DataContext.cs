﻿using Entities.Interfaces;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace Database
{
    public class DataContext : DbContext
    {
        public DataContext(DbContextOptions options) : base(options)
        {
        }
        public DbSet<AppUser> AppUser { get; set; }
        public DbSet<AppRole> AppRole { get; set; }
        public DbSet<AppUserRole> AppUserRole { get; set; }
        public DbSet<Employee> Employee { get; set; }
        public DbSet<Department> Department { get; set; }
        public DbSet<Evaluate> Evaluate { get; set; }
        public DbSet<RequestOff> RequestOff { get; set; }
        public DbSet<PayOff> PayOff { get; set; }
        public DbSet<Salary> Salary { get; set; }
        public DbSet<TimeKeeping> TimeKeeping { get; set; }
        public DbSet<TimeWorking> TimeWorking { get; set; }
        public DbSet<Project> Project { get; set; }
        public DbSet<Issue> Issue { get; set; }
        public DbSet<Message> Message { get; set; }
        public DbSet<MemberProject> MemberProject { get; set; }
        public DbSet<Position> Position { get; set; }
        public DbSet<EmployeeSalary> EmployeeSalary { get; set; }
        public DbSet<Notification> Notification { get; set; }
        public DbSet<NotificationEmployee> NotificationEmployee { get; set; }
        public DbSet<SalaryReport> SalaryReport { get; set; }
        public DbSet<Job> Job { get; set; }
        public DbSet<Candidate> Candidate { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);
            builder.ApplyBaseEntityConfiguration();
        }
        public override int SaveChanges()
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is IHasCreatorUserId hasCreatorUserIdEntity && entry.State == EntityState.Added)
                {
                    hasCreatorUserIdEntity.CreationTime = DateTime.Now;
                }
                else if (entry.Entity is IHasLastModifierUserId hasLastModifierUserIdEntity && entry.State == EntityState.Modified)
                {
                    hasLastModifierUserIdEntity.LastModificationTime = DateTime.Now;
                }
                else if (entry.Entity is ISoftDelete softDeleteEntity && entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    softDeleteEntity.DeletionTime = DateTime.Now;
                    softDeleteEntity.IsDeleted = true;
                }
            }
            return base.SaveChanges();
        }

        public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
        {
            foreach (var entry in ChangeTracker.Entries())
            {
                if (entry.Entity is IHasCreatorUserId hasCreatorUserIdEntity && entry.State == EntityState.Added)
                {
                    hasCreatorUserIdEntity.CreationTime = DateTime.Now;
                }
                else if (entry.Entity is IHasLastModifierUserId hasLastModifierUserIdEntity && entry.State == EntityState.Modified)
                {
                    hasLastModifierUserIdEntity.LastModificationTime = DateTime.Now;
                }
                else if (entry.Entity is ISoftDelete softDeleteEntity && entry.State == EntityState.Deleted)
                {
                    entry.State = EntityState.Modified;
                    softDeleteEntity.DeletionTime = DateTime.Now;
                    softDeleteEntity.IsDeleted = true;
                }
            }
            return await base.SaveChangesAsync(cancellationToken);
        }
    }
}
