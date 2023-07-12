using Entities.Enum;
using System;

namespace Business.DTOs.OnLeaveDto
{
    public class UpdateStatusRequestOffDto
    {
        public Guid Id { get; set; }
        public Guid PmId { get; set; }
        public Status Status { get; set; }
    }
}
