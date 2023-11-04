using Entities.Enum.Record;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class RequestOff : BaseEntity<Guid>
    {
        [ForeignKey("AppUserId")]
        public Guid UserId { get; set; }
        public DateTime DayOff { get; set; }
        public OptionRequest Option { get; set; }
        public string? Reason { get; set; }
        public RecordStatus Status { get; set; }
    }
}
