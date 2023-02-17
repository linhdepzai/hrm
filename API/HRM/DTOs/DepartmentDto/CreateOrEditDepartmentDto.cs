using System;

namespace HRM.DTOs.DepartmentDto
{
    public class CreateOrEditDepartmentDto
    {
        public Guid? Id { get; set; }
        public string Name { get; set; }
        public string Color { get; set; }
    }
}
