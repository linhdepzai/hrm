using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System;
using Entities.Enum;

namespace Entities
{
    public class Project : BaseEntity<Guid>
    {
        [Required, StringLength(50)]
        public string? ProjectName { get; set; }
        public string? Description { get; set; }
        [Required, StringLength(50)]
        public ProjectType ProjectType { get; set; }
        [Required, StringLength(50)]
        public string? ProjectCode { get; set; }
        [Required]
        public DateTime CreateDate { get; set; }
        [Required]
        public DateTime DeadlineDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        [Required]
        public Priority PriorityCode { get; set; }
        [Required]
        public StatusTask StatusCode { get; set; }
        public ICollection<Tasks> Tasks { get; set; }
        public ICollection<MemberProject> MemberProject { get; set; }
    }
}
