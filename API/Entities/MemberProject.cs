using System.ComponentModel.DataAnnotations.Schema;
using System;
using System.ComponentModel.DataAnnotations;
using Entities.Enum;

namespace Entities
{
    public class MemberProject : BaseEntity<Guid>
    {
        [ForeignKey("Project")]
        public Guid ProjectId { get; set; }
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public MemberType Type { get; set; }
    }
}
