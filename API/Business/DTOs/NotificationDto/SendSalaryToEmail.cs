using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.DTOs.NotificationDto
{
    public class SendSalaryToEmail
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public DateTime CreateDate { get; set; }
        public string Position { get; set; }
        public string Level { get; set; }
        public string SalaryCode { get; set; }
        public string Salary { get; set; }
        public string Welfare { get; set; }
        public string Workdays { get; set; }
        public string Punish { get; set; }
        public string Bonus { get; set; }
        public string Total { get; set; }
    }
}
