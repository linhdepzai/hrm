using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.DTOs.DepartmentDto
{
    public class DepartmentForViewDto
    {
        public Guid Id { get; set; }
        public string? Name { get; set; }
        public string? Color { get; set; }
        public string? Icon { get; set; }
        public Guid Boss { get; set; }
        public string? BossName { get; set; }
    }
}
