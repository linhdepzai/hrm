using System.ComponentModel.DataAnnotations.Schema;
using System;
using HRM.Enum;
using System.ComponentModel.DataAnnotations;

namespace HRM.Entities
{
    public class MemberProject
    {
        [Key]
        public Guid Id { get; set; }
        [ForeignKey("Project")]
        public Guid ProjectId { get; set; }
        [ForeignKey("Employee")]
        public Guid EmployeeId { get; set; }
        public MemberType Type { get; set; }
    }
}
