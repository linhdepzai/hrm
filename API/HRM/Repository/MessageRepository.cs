using HRM.Data;
using HRM.Entities;
using HRM.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using HRM.DTOs.MessageDto;
using Microsoft.AspNetCore.Mvc;

namespace HRM.Repository
{
    public class MessageRepository : IMessageRepository
    {
        private readonly DataContext _context;

        public MessageRepository(DataContext context)
        {
            _context = context;
        }

        public void AddMessage(Message message)
        {
            _context.Message.Add(message);
        }

        public void DeleteMessage(Message message)
        {
            _context.Message.Remove(message);
        }

        public async Task<Message> GetMessage(Guid id)
        {
            return await _context.Message.FindAsync(id);
        }

        public async Task<List<MessageDto>> GetMessageForUser(Guid id)
        {
            var message = await (from m in _context.Message
                                 where m.SenderId == id || m.RecipientId == id
                                 orderby m.MessageSent descending
                                 select new MessageDto
                                 {
                                     Id = m.Id,
                                     SenderId = m.SenderId,
                                     SenderUserName = m.SenderUserName,
                                     SenderPhotoUrl = _context.Employee.Where(i => i.Id == m.SenderId && i.Status == Enum.Status.Approved).First().Avatar,
                                     RecipientId = m.RecipientId,
                                     RecipientUserName = m.RecipientUserName,
                                     RecipientPhotoUrl = _context.Employee.Where(i => i.Id == m.RecipientId && i.Status == Enum.Status.Approved).First().Avatar,
                                     Content = m.Content,
                                     DateRead = m.DateRead,
                                     MessageSent = m.MessageSent,
                                     TotalUnSeen = _context.Message.Where(i => i.SenderId == m.SenderId && i.RecipientId == id && i.DateRead == null).Count()
                                 }).AsNoTracking().ToListAsync();
            var result = new List<MessageDto>();
            foreach (var i in message)
            {
                var userIdExist = i.SenderId == id ? i.RecipientId : i.SenderId;
                if(result.Where(e => e.SenderId == userIdExist || e.RecipientId == userIdExist).Count() != 1) result.Add(i);
            }
            return result;
        }

        public async Task<IEnumerable<Message>> GetMessageThread(Guid currentUserId, Guid recipientId)
        {
            var messages = await _context.Message
                .Where(m => m.RecipientId == recipientId && m.SenderId == currentUserId
                    || m.RecipientId == currentUserId && m.SenderId == recipientId)
                .OrderBy(m => m.MessageSent).AsNoTracking()
                .ToListAsync();
            var unreadMessages = await _context.Message.Where(m => m.DateRead == null && m.RecipientId == currentUserId).ToListAsync();
            if (unreadMessages.Count > 0)
            {
                foreach (var message in unreadMessages)
                {
                    message.DateRead = DateTime.Now;
                }
                await _context.SaveChangesAsync();
            }
            return messages;
        }

        public async Task<bool> SaveAllAsync()
        {
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
