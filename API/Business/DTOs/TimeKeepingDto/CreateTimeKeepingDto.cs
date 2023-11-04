using System;

namespace Business.DTOs.TimeKeepingDto
{
    public class CreateTimeKeepingDto
    {
        public DateTime Checkin { get; set; }
        public string PhotoCheckin { get; set; }
        public DateTime Checkout { get; set; }
        public string PhotoCheckout { get; set; }
    }
}
