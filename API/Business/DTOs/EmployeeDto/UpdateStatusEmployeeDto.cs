using Entities.Enum;
using System;

namespace Business.DTOs.EmployeeDto
{
    public class UpdateStatusEmployeeDto
    {
        public Guid Id { get; set; }
        public Guid PmId { get; set; }
        public Status Status { get; set; }
    }
}
