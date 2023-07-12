using Entities.Enum;
using System;

namespace Business.DTOs.SalaryDto
{
    public class CreateSalaryDto
    {
        public Guid ActionId { get; set; }
        public Level Level { get; set; }
        public int Position { get; set; }
        public int Money { get; set; }
        public int Welfare { get; set; }
    }
}
