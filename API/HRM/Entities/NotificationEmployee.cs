using System;

namespace HRM.Entities
{
    public class NotificationEmployee : BaseEntity<Guid>
    {
        public Guid NotificationId { get; set; }
        public Guid EmployeeId { get; set; }
        public bool IsRead { get; set; }
    }
}
