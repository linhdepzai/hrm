using System;
using System.Collections.Generic;

namespace Business.DTOs.SalaryDto
{
    public class SendNotificationSalaryDto
    {
        public Guid ActionId { get; set; }
        public int Month { get; set; }
        public int Year { get; set; }
        public List<EmployeeIdList> Employee { get; set; }
    }
    public class EmployeeIdList
    {
        public Guid EmployeeId { get; set; }
    }
}
