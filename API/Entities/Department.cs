using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Entities
{
    public class Department : BaseEntity<Guid>
    {
        public string? Name { get; set; }
        public string? Color { get; set; }
        public string? Icon { get; set; }
        public Guid Boss { get; set; }
        public ICollection<Employee> Employee { get; set; }

    }
}
