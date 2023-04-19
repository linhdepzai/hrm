using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System;

namespace HRM.Entities
{
    public class Message : BaseEntity<Guid>
    {
        [Required, ForeignKey("Employee")]
        public Guid SenderId { get; set; }
        [Required, StringLength(40)]
        public string SenderUserName { get; set; }
        public Employee Sender { get; set; }
        [Required, ForeignKey("Employee")]
        public Guid RecipientId { get; set; }
        [Required, StringLength(40)]
        public string RecipientUserName { get; set; }
        public Employee Recipient { get; set; }
        public string Content { get; set; }
        public DateTime? DateRead { get; set; }
        public DateTime MessageSent { get; set; } = DateTime.Now;
        public bool SenderDeleted { get; set; }
        public bool RecipientDeleted { get; set; }
    }
}
