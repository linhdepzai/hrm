using Business.DTOs.EmailDto;
using MimeKit.Text;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Business.Interfaces.IEmailServce
{
    public interface IEmailSender
    {
        void SendEmail(EmailMessage message, TextFormat textFormat = TextFormat.Text);
        Task SendEmailAsync(EmailMessage message, TextFormat textFormat = TextFormat.Text);
    }
}
