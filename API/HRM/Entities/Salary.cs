using HRM.Enum;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRM.Entities
{
    public class Salary : BaseEntity<Guid>
    {
        public string SalaryCode { get; set; }
        public Level Level { get; set; }
        public int Position { get; set; }
        public int Money { get; set; }
        public int Welfare { get; set; }
        public ICollection<EmployeeSalary> EmployeeSalary { get; set; }
    }
}
