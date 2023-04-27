using HRM.Enum;
using System;

namespace HRM.DTOs.OnLeaveDto
{
    public class UpdateStatusRequestOffDto
    {
        public Guid Id { get; set; }
        public Guid PmId { get; set; }
        public Status Status { get; set; }
    }
}
