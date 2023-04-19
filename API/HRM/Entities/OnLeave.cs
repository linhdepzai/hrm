using HRM.Enum;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRM.Entities
{
    public class OnLeave : BaseEntity<Guid>
    {
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public DateTime DateLeave { get; set; }
        public OptionOnLeave Option { get; set; }
        public string Reason { get; set; }
        public Status Status { get; set; }
    }
}
