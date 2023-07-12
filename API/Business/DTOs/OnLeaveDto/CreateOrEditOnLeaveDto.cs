using System;
using System.Collections.Generic;

namespace Business.DTOs.OnLeaveDto
{
    public class CreateOrEditOnLeaveDto
    {
        public Guid EmployeeId { get; set; }
        public List<OnLeaveDto> OnLeave { get; set; }
    }
}
