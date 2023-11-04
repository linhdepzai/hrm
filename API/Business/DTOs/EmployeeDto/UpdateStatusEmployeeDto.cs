using Entities.Enum;
using Entities.Enum.Record;
using System;

namespace Business.DTOs.EmployeeDto
{
    public class UpdateStatusEmployeeDto
    {
        public Guid Id { get; set; }
        public RecordStatus Status { get; set; }
    }
}
