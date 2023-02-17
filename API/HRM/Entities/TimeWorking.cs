using HRM.Enum;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRM.Entities
{
    public class TimeWorking
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public TimeSpan MorningStartTime { get; set; }
        public TimeSpan MorningEndTime { get; set; }
        public TimeSpan AfternoonStartTime { get; set; }
        public TimeSpan AfternoonEndTime { get; set; }
        public DateTime ApplyDate { get; set; }
        public string Details { get; set; }
        public Status Status { get; set; }
    }
}
