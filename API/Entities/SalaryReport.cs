using Entities.Enum.Record;
using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class SalaryReport : BaseEntity<Guid>
    {
        [ForeignKey("AppUserId")]
        public Guid UserId { get; set; }
        [ForeignKey("Salary")]
        public Guid Salary { get; set; }
        public DateTime Date { get; set; }
        public int TotalWorkdays { get; set; }
        public int Punish { get; set; }
        public int Bounty { get; set; }
        public int ActualSalary { get; set; }
        public ConfirmStatus IsConfirm { get; set; }
    }
}
