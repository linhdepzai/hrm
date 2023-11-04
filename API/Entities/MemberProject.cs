using Entities.Enum.Project;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class MemberProject : BaseEntity<Guid>
    {
        [ForeignKey("Project")]
        public Guid ProjectId { get; set; }
        [ForeignKey("AppUserId")]
        public Guid UserId { get; set; }
        public MemberType Type { get; set; }
    }
}
