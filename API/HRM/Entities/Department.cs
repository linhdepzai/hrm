using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace HRM.Entities
{
    public class Department
    {
        [Key]
        public Guid Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
        public string Icon { get; set; }
        public ICollection<Employee> Employee { get; set; }

    }
}
