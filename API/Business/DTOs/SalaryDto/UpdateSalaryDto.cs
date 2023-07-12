using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Business.DTOs.SalaryDto
{
    public class UpdateSalaryDto
    {
        public Guid Id { get; set; }
        public Guid ActionId { get; set; }
        public Guid Salary { get; set; }
        public DateTime Date { get; set; }
        public int TotalWorkdays { get; set; }
        public int Punish { get; set; }
        public int Bounty { get; set; }
        public int ActualSalary { get; set; }
    }
}
