using HRM.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace HRM.DTOs.TimeWorkingDto
{
    public class CreateOrEditTimeWorkingDto
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
        public DateTime MorningStartTime { get; set; }
        public DateTime MorningEndTime { get; set; }
        public DateTime AfternoonStartTime { get; set; }
        public DateTime AfternoonEndTime { get; set; }
        public DateTime ApplyDate { get; set; }
    }
}
