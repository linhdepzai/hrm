using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRM.Entities
{
    public class Salary : BaseEntity<Guid>
    {
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public int Money { get; set; }
        public int Welfare { get; set; }
        public DateTime DateReview { get; set; }
    }
}
