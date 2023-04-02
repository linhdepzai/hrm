using System;

namespace HRM.DTOs.TimeKeepingDto
{
    public class CheckoutDto
    {
        public Guid? Id { get; set; }
        public DateTime Checkout { get; set; }
        public string PhotoCheckout { get; set; }
    }
}