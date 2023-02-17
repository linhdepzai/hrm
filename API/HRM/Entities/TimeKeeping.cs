using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRM.Entities
{
    public class TimeKeeping
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public DateTime Checkin { get; set; }
        public string PhotoCheckin { get; set; }
        public DateTime Checkout { get; set; }
        public string PhotoCheckout { get; set; }
        public bool Punish { get; set; }
    }
}
