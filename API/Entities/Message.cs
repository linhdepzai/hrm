using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace Entities
{
    public class Message : BaseEntity<Guid>
    {
        [Required, ForeignKey("AppUserId")]
        public Guid SenderId { get; set; }
        [Required, ForeignKey("AppUserId")]
        public Guid RecipientId { get; set; }
        public string? Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.Now;
        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }
    }
}
