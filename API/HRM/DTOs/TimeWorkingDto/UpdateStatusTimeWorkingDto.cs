using HRM.Enum;
using System;

namespace HRM.DTOs.TimeWorkingDto
{
    public class UpdateStatusTimeWorkingDto
    {
        public Guid Id { get; set; }
        public Status Status { get; set; }
    }
}
