using Entities.Enum;
using Entities.Enum.Record;
using System;

namespace Business.DTOs.OnLeaveDto
{
    public class UpdateStatusRequestOffDto
    {
        public Guid Id { get; set; }
        public RecordStatus Status { get; set; }
    }
}
