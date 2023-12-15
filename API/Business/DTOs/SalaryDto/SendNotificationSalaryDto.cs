using System;
using System.Collections.Generic;

namespace Business.DTOs.SalaryDto
{
    public class SendNotificationSalaryDto
    {
        public int Month { get; set; }
        public int Year { get; set; }
        public List<EmployeeIdList> Employee { get; set; }
    }
    public class EmployeeIdList
    {
        public Guid UserId { get; set; }
    }
}
