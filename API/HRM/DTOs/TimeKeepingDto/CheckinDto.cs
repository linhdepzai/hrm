using System;

namespace HRM.DTOs.TimeKeepingDto
{
    public class CheckinDto
    {
        public Guid EmployeeId { get; set; }
        public DateTime Checkin { get; set; }
        public string PhotoCheckin { get; set; }
    }
}
