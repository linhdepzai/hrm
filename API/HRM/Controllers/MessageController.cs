using CoreApiResponse;
using HRM.Data;
using HRM.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using HRM.Interfaces;
using HRM.DTOs.MessageDto;
using HRM.Repository;
using System.Net;

namespace HRM.Controllers
{
    [Route("api/message")]
    [ApiController]
    public class MessageController : BaseController
    {
        private readonly DataContext _dataContext;
        private readonly IMessageRepository _messageRepository;

        public MessageController(DataContext dataContext, IMessageRepository messageRepository)
        {
            _dataContext = dataContext;
            _messageRepository = messageRepository;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateMessage(CreateMessageDto createMessageDto)
        {
            var sender = await _dataContext.Employee.FindAsync(createMessageDto.SenderId);
            var recipient = await _dataContext.Employee.FindAsync(createMessageDto.RecipientId);

            if (sender == recipient) return CustomResult("You cannot send messages to yourself", HttpStatusCode.BadRequest);

            if (recipient == null) return NotFound();

            var message = new Message
            {
                Id = new Guid(),
                SenderId = sender.Id,
                SenderUserName = sender.FullName,
                RecipientId = recipient.Id,
                RecipientUserName = recipient.FullName,
                Content = createMessageDto.Content,
            };
            _messageRepository.AddMessage(message);
            if (await _messageRepository.SaveAllAsync()) return CustomResult(message);
            return CustomResult("Failed to send message", HttpStatusCode.BadRequest);
        }

        [HttpGet("thread/{recipientUserId}")]
        public async Task<IActionResult> GetMessagesThread(Guid recipientUserId, Guid currentUserId)
        {
            var message = await _messageRepository.GetMessageThread(currentUserId, recipientUserId);
            return CustomResult(message);
        }
        [HttpGet("getAll")]
        public async Task<IActionResult> GetMessageForUser(Guid id)
        {
            var message = await _messageRepository.GetMessageForUser(id);
            return CustomResult(message);
        }
    }
}
