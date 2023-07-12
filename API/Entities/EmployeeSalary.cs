using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class EmployeeSalary : BaseEntity<Guid>
    {
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        [ForeignKey("Salary")]
        public Guid Salary { get; set; }
        public DateTime Date { get; set; }
        public int TotalWorkdays { get; set; }
        public int Punish { get; set; }
        public int Bounty { get; set; }
        public int ActualSalary { get; set; }
        public int IsConfirm { get; set; }
    }
}
