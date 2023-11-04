using Entities.Enum.User;

namespace Entities
{
    public class Salary : BaseEntity<Guid>
    {
        public string? SalaryCode { get; set; }
        public Level Level { get; set; }
        public Guid PositionId { get; set; }
        public int Money { get; set; }
        public int Welfare { get; set; }
        public ICollection<EmployeeSalary> EmployeeSalary { get; set; }
    }
}
