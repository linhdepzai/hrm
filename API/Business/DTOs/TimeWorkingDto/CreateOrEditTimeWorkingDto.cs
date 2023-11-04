using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace Business.DTOs.TimeWorkingDto
{
    public class CreateOrEditTimeWorkingDto
    {
        public DateTime MorningStartTime { get; set; }
        public DateTime MorningEndTime { get; set; }
        public DateTime AfternoonStartTime { get; set; }
        public DateTime AfternoonEndTime { get; set; }
        public DateTime ApplyDate { get; set; }
    }
}
