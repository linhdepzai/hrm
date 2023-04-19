using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HRM.Entities
{
    public class Department : BaseEntity<Guid>
    {
        public string Name { get; set; }
        public string Color { get; set; }
        public string Icon { get; set; }
        public ICollection<Employee> Employee { get; set; }

    }
}
