namespace Entities
{
    public class Position : BaseEntity<Guid>
    {
        public string? Name { get; set; }
        public string? Color { get; set; }
        public ICollection<Employee> Employee { get; set; }
    }
}
