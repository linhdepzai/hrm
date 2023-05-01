using System;

namespace HRM.DTOs.SalaryDto
{
    public class UpdateSalaryDto
    {
        public Guid Id { get; set; }
        public Guid Accoutant { get; set; }
        public int Money { get; set; }
        public int Welfare { get; set; }
    }
}
