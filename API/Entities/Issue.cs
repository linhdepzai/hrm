using Entities.Enum.Project;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class Issue : BaseEntity<Guid>
    {
        [Required, StringLength(50)]
        public string? TaskName { get; set; }
        [Required]
        public Guid CreateUserId { get; set; }
        [Required]
        public DateTime CreateDate { get; set; }
        [Required]
        public DateTime DeadlineDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        [Required, StringLength(50)]
        public Priority PriorityCode { get; set; }
        [Required, StringLength(50)]
        public WorkStatus StatusCode { get; set; }
        public string? Description { get; set; }
        [Required, StringLength(50)]
        public string? TaskType { get; set; }
        [Required, StringLength(50)]
        public string? TaskCode { get; set; }
        public string? ReasonForDelay { get; set; }
        [Required]
        [ForeignKey("Project")]
        public Guid ProjectId { get; set; }
        [ForeignKey("AppUserId")]
        public Guid UserId { get; set; }
    }
}
