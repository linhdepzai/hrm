using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class PayOff : BaseEntity<Guid>
    {
        [ForeignKey("AppUserId")]
        public Guid UserId { get; set; }
        public string? Reason { get; set; }
        public int Amount { get; set; }
        public bool Punish { get; set; } // 0: Punish, 1: Bounty
        public DateTime Date { get; set; }
    }
}
