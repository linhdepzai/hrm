using System;
using System.ComponentModel.DataAnnotations;

namespace HRM.Entities
{
    public class Notification : BaseEntity<Guid>
    {
        public string Thumbnail { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public DateTime CreateDate { get; set; }
    }
}
