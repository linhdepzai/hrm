using System;

namespace Business.DTOs.PayoffDto
{
    public class CreateOrEditPayOffDto
    {
        public Guid? Id { get; set; }
        public Guid UserId { get; set; }
        public string Reason { get; set; }
        public int Amount { get; set; }
        public DateTime Date { get; set; }
        public bool Punish { get; set; }
    }
}
