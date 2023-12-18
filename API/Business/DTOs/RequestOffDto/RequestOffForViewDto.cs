using Entities.Enum.Record;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.DTOs.RequestOffDto
{
    public class RequestOffForViewDto
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public string? AvatarUser { get; set; }
        public string? Name { get; set; }
        public DateTime DayOff { get; set; }
        public OptionRequest Option { get; set; }
        public string? Reason { get; set; }
        public RecordStatus Status { get; set; }
        public bool IsAction { get; set; }
        public DateTime? CreationTime { get; set; }
        public DateTime? LastModificationTime { get; set; }
        public string? LastModifierUserId { get; set; }
    }
}
