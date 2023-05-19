using System;

namespace HRM.DTOs.NotificationDto
{
    public class UnreadNotifiesDto
    {
        public Guid Id { get; set; }
        public Guid EmployeeId { get; set; }
    }
}
