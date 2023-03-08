using HRM.DTOs.EmployeeDto;
using HRM.Entities;
using System;
using System.Collections.Generic;

namespace HRM.DTOs.OnLeaveDto
{
    public class CreateOrEditOnLeaveDto
    {
        public Guid EmployeeId { get; set; }
        public List<OnLeaveDto> OnLeave { get; set; }
    }
}
