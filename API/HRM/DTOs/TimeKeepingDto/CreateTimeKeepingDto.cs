using System;

namespace HRM.DTOs.TimeKeepingDto
{
    public class CreateTimeKeepingDto
    {
        public Guid? Id { get; set; }
        public Guid EmployeeId { get; set; }
        public DateTime Checkin { get; set; }
        public string PhotoCheckin { get; set; }
        public DateTime Checkout { get; set; }
        public string PhotoCheckout { get; set; }
    }
}
