using Entities.Enum;
using System;

namespace Business.DTOs.OnLeaveDto
{
    public class OnLeaveDto
    {
        public DateTime DateLeave { get; set; }
        public OptionOnLeave Option { get; set; }
        public string Reason { get; set; }
    }
}
