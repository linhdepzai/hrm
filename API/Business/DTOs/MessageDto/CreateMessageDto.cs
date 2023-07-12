using System;

namespace Business.DTOs.MessageDto
{
    public class CreateMessageDto
    {
        public Guid SenderId { get; set; }
        public Guid RecipientId { get; set; }
        public string Content { get; set; }
    }
}
