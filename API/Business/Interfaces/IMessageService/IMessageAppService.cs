using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using Business.DTOs.MessageDto;
using Entities;

namespace Business.Interfaces.IMessageService
{
    public interface IMessageAppService
    {
        public void AddMessage(Message message);
        public void DeleteMessage(Message message);
        public Task<Message> GetMessage(Guid id);
        public Task<List<MessageDto>> GetMessageForUser(Guid id);
        public Task<IEnumerable<Message>> GetMessageThread(Guid currentUserId, Guid recipientId);
        Task<bool> SaveAllAsync();
    }
}
