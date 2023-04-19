using HRM.Enum;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace HRM.Entities
{
    public class Evaluate : BaseEntity<Guid>
    {
        public DateTime DateEvaluate { get; set; }
        public Guid PMId { get; set; }
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public Level OldLevel { get; set; }
        public Level NewLevel { get; set; }
        public string Note { get; set; }
    }
}
