using Entities.Enum;
using System;

namespace Business.DTOs.TimeWorkingDto
{
    public class UpdateStatusTimeWorkingDto
    {
        public Guid Id { get; set; }
        public Status Status { get; set; }
    }
}
