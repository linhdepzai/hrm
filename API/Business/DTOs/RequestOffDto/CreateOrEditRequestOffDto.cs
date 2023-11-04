using Entities.Enum.Record;
using System;
using System.Collections.Generic;

namespace Business.DTOs.RequestOffDto
{
    public class CreateOrEditRequestOffDto
    {
        public DateTime DayOff { get; set; }
        public OptionRequest Option { get; set; }
        public string Reason { get; set; }
    }
}
