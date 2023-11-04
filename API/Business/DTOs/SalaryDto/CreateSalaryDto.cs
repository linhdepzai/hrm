using Entities.Enum;
using Entities.Enum.User;
using System;

namespace Business.DTOs.SalaryDto
{
    public class CreateSalaryDto
    {
        public Level Level { get; set; }
        public Guid PositionId { get; set; }
        public int Money { get; set; }
        public int Welfare { get; set; }
    }
}
