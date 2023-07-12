using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class SalaryForEmployee : BaseEntity<Guid>
    {
        public Guid EmployeeId { get; set; }
        public Guid Salary { get; set; }
    }
}
