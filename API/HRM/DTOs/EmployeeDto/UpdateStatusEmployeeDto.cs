using HRM.Enum;
using System;

namespace HRM.DTOs.EmployeeDto
{
    public class UpdateStatusEmployeeDto
    {
        public Guid Id { get; set; }
        public Status Status { get; set; }
    }
}
