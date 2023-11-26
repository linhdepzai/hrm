namespace Entities
{
    public class EmployeeSalary : BaseEntity<Guid>
    {
        public Guid AppUserId { get; set; }
        public Guid SalaryId { get; set; }
    }
}
