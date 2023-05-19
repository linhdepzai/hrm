using System;
using System.ComponentModel.DataAnnotations;

namespace HRM.Entities
{
    public class Notification : BaseEntity<Guid>
    {
        public string Content { get; set; }
        public Guid EmployeeId { get; set; }
        public DateTime CreateDate { get; set; }
        public bool IsRead { get; set; }
        public Guid AnyId { get; set; }
    }
}
