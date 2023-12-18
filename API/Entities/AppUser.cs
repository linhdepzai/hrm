using System.ComponentModel.DataAnnotations;

namespace Entities
{
    public class AppUser
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        [StringLength(500), DataType(DataType.Url)]
        public string? AvatarUrl { get; set; }
        [StringLength(100)]
        public string? PublicId { get; set; }
        public bool IsActive { get; set; } = true;

        //Relationship
        public ICollection<Employee> Employee { get; set; }
        public ICollection<PayOff> PayOff { get; set; }
        public ICollection<TimeKeeping> TimeKeeping { get; set; }
        public ICollection<RequestOff> RequestOff { get; set; }
        public ICollection<TimeWorking> TimeWorking { get; set; }
        public ICollection<Evaluate> Evaluate { get; set; }
        public ICollection<EmployeeSalary> EmployeeSalary { get; set; }
        public ICollection<Issue> Issue { get; set; }
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
        public ICollection<MemberProject> MemberProject { get; set; }
        public ICollection<Notification> Notification { get; set; }
    }
}
