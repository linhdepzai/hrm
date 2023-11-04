using CoreApiResponse;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using System.Net;
using Database;
using Business.DTOs.MessageDto;
using Business.Interfaces.IMessageService;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace HRM.Controllers
{
    public class MessageController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly IMessageAppService _messageService;

        public MessageController(DataContext dataContext, IMessageAppService messageService)
        {
            _dataContext = dataContext;
            _messageService = messageService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateMessage(CreateMessageDto createMessageDto)
        {
            var sender = await _dataContext.Employee.FirstOrDefaultAsync(i => i.AppUserId == createMessageDto.SenderId && i.Status == Entities.Enum.Record.RecordStatus.Approved);
            var recipient = await _dataContext.Employee.FirstOrDefaultAsync(i => i.AppUserId == createMessageDto.RecipientId && i.Status == Entities.Enum.Record.RecordStatus.Approved);

            if (sender == recipient) return CustomResult("You cannot send messages to yourself", HttpStatusCode.BadRequest);

            if (recipient == null) return NotFound();

            var message = new Message
            {
                Id = new Guid(),
                SenderId = sender.AppUserId,
                RecipientId = recipient.AppUserId,
                Content = createMessageDto.Content,
            };
            _messageService.AddMessage(message);
            if (await _messageService.SaveAllAsync()) return CustomResult(message);
            return CustomResult("Failed to send message", HttpStatusCode.BadRequest);
        }

        [HttpGet("thread/{recipientUserId}")]
        public async Task<IActionResult> GetMessagesThread(Guid recipientUserId, Guid currentUserId)
        {
            var message = await _messageService.GetMessageThread(currentUserId, recipientUserId);
            return CustomResult(message);
        }
        [HttpGet("getAll")]
        public async Task<IActionResult> GetMessageForUser(Guid id)
        {
            var message = await _messageService.GetMessageForUser(id);
            return CustomResult(message);
        }
    }
}
