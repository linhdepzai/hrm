using System.Collections.Generic;

namespace HRM.Entities
{
    public class Position
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public ICollection<Employee> Employee { get; set; }
    }
}
