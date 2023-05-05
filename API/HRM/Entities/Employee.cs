using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;
using HRM.Enum;

namespace HRM.Entities
{
    public class Employee : BaseEntity<Guid>
    {
        public string UserCode { get; set; }
        [Required, StringLength(50)]
        public string FullName { get; set; }
        [Required]
        public bool Sex { get; set; }
        [Required, StringLength(50)]
        public string Email { get; set; }
        public string Password { get; set; }
        [Required, StringLength(11)]
        public string Phone { get; set; }
        [Required]
        public DateTime DoB { get; set; }
        [Required]
        public Level Level { get; set; }
        [Required]
        public int Position { get; set; }
        [ForeignKey("Department")]
        public Guid? DepartmentId { get; set; }
        [Required]
        public DateTime StartingDate { get; set; }
        public DateTime? LeaveDate { get; set; }
        public string Bank { get; set; }
        public string BankAccount { get; set; }
        public string TaxCode { get; set; }
        public string InsuranceStatus { get; set; }
        public string Identify { get; set; }
        public string PlaceOfOrigin { get; set; }
        public string PlaceOfResidence { get; set; }
        public string DateOfIssue { get; set; }
        public string IssuedBy { get; set; }
        public Status Status { get; set; }
        public ICollection<Payoff> Payoff { get; set; }
        public ICollection<TimeKeeping> TimeKeeping { get; set; }
        public ICollection<OnLeave> OnLeave { get; set; }
        public ICollection<TimeWorking> TimeWorking { get; set; }
        public ICollection<Evaluate> Evaluate { get; set; }
        public ICollection<Salary> Salary { get; set; }
        public ICollection<Tasks> Tasks { get; set; }
        public ICollection<Message> MessagesSent { get; set; }
        public ICollection<Message> MessagesReceived { get; set; }
        public ICollection<MemberProject> MemberProject { get; set; }
    }
}
