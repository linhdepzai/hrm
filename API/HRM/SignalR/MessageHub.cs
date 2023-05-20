using HRM.Data;
using HRM.DTOs.MessageDto;
using HRM.Entities;
using HRM.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using HRM.Repository;
using System.Linq;

namespace HRM.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IMessageRepository _messageRepository;
        private readonly DataContext _dataContext;

        public MessageHub(
            IMessageRepository messageRepository,
            DataContext dataContext)
        {
            _messageRepository = messageRepository;
            _dataContext = dataContext;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var currentUserId = httpContext.Request.Query["currentUserId"].ToString();
            var recipientUserId = httpContext.Request.Query["recipientUserId"].ToString();

            var groupName = GetGroupName(Context.User.Identity.Name, _dataContext.Employee.Where(i => i.Id == new Guid(recipientUserId)).First().FullName);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var messages = await _messageRepository.GetMessageThread(new Guid(currentUserId), new Guid(recipientUserId));
            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var sender = await _dataContext.Employee.FindAsync(createMessageDto.SenderId);
            var recipient = await _dataContext.Employee.FindAsync(createMessageDto.RecipientId);

            if (recipient == null) throw new HubException("Not found user");

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
            if (await _messageRepository.SaveAllAsync())
            {
                var group = GetGroupName(sender.FullName, recipient.FullName);
                await Clients.Group(group).SendAsync("NewMessage", message);
            }
        }



        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}
