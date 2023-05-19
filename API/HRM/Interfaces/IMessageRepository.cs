using HRM.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using HRM.DTOs.MessageDto;

namespace HRM.Interfaces
{
    public interface IMessageRepository
    {
        public void AddMessage(Message message);
        public void DeleteMessage(Message message);
        public Task<Message> GetMessage(Guid id);
        public Task<List<MessageDto>> GetMessageForUser(Guid id);
        public Task<IEnumerable<Message>> GetMessageThread(Guid currentUserId, Guid recipientId);
        Task<bool> SaveAllAsync();
    }
}
