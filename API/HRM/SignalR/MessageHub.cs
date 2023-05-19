using HRM.Data;
using HRM.DTOs.MessageDto;
using HRM.Entities;
using HRM.Interfaces;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using System;

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
            var otherUser = httpContext.Request.Query["user"].ToString().Replace('-', ' ');
            //var id = httpContext.Request.Query["id"].ToString();
            var groupName = GetGroupName(Context.User.Identity.Name, otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            //var messages = await _messageRepository.GetMessageThread(Guid.Parse(id));
            //await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
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
            await _dataContext.Message.AddAsync(message);
            await _dataContext.SaveChangesAsync();
        }



        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}
