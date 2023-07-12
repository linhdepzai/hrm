using System;

namespace Business.DTOs.TimeKeepingDto
{
    public class CheckoutDto
    {
        public Guid EmployeeId { get; set; }
        public DateTime Checkout { get; set; }
        public string PhotoCheckout { get; set; }
    }
}