using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;
using System.Linq;
using Business.Interfaces.IMessageService;
using Database;
using Business.DTOs.MessageDto;
using Entities;

namespace Business.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IMessageAppService _messageService;
        private readonly DataContext _dataContext;

        public MessageHub(
            IMessageAppService messageService,
            DataContext dataContext)
        {
            _messageService = messageService;
            _dataContext = dataContext;
        }

        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var currentUserId = httpContext.Request.Query["currentUserId"].ToString();
            var recipientUserId = httpContext.Request.Query["recipientUserId"].ToString();

            var groupName = GetGroupName(Context.User.Identity.Name, _dataContext.Employee.Where(i => i.Id == new Guid(recipientUserId)).First().FullName);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            var messages = await _messageService.GetMessageThread(new Guid(currentUserId), new Guid(recipientUserId));
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
            _messageService.AddMessage(message);
            if (await _messageService.SaveAllAsync())
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
