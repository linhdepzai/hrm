using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class TimeKeeping : BaseEntity<Guid>
    {
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public DateTime Date { get; set; }
        public DateTime Checkin { get; set; }
        public string? PhotoCheckin { get; set; }
        public DateTime Checkout { get; set; }
        public string? PhotoCheckout { get; set; }
        public string? Complain { get; set; }
        public bool Punish { get; set; }
    }
}
