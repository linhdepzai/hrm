using HRM.Enum;
using System;

namespace HRM.DTOs.OnLeaveDto
{
    public class OnLeaveDto
    {
        public DateTime DateLeave { get; set; }
        public OptionOnLeave Option { get; set; }
        public string Reason { get; set; }
    }
}
