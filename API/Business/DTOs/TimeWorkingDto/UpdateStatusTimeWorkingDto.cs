using Entities.Enum;
using Entities.Enum.Record;
using System;

namespace Business.DTOs.TimeWorkingDto
{
    public class UpdateStatusTimeWorkingDto
    {
        public Guid Id { get; set; }
        public RecordStatus Status { get; set; }
    }
}
