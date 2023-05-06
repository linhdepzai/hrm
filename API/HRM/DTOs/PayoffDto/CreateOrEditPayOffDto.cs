using System;

namespace HRM.DTOs.PayoffDto
{
    public class CreateOrEditPayOffDto
    {
        public Guid? Id { get; set; }
        public Guid ActionId { get; set; }
        public Guid EmployeeId { get; set; }
        public string Reason { get; set; }
        public int Amount { get; set; }
        public DateTime Date { get; set; }
    }
}
