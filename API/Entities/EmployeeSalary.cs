namespace Entities
{
    public class EmployeeSalary : BaseEntity<Guid>
    {
        public Guid EmployeeId { get; set; }
        public Guid Salary { get; set; }
    }
}
