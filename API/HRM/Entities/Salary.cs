using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRM.Entities
{
    public class Salary
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public int Money { get; set; }
        public DateTime DateReview { get; set; }
    }
}
