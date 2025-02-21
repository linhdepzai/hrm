﻿using Business.Interfaces.IEmailServce;
using MimeKit.Text;
using MimeKit;
using Business.DTOs.EmailDto;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;
using Microsoft.Extensions.Options;

namespace Business.Services.EmailService
{
    public class EmailSender : IEmailSender
    {
        private readonly EmailConfigurationSettings _emailConfig;
        public EmailSender(IOptionsMonitor<EmailConfigurationSettings> emailConfig)
        {
            _emailConfig = emailConfig.CurrentValue;
        }
        public void SendEmail(EmailMessage message, TextFormat textFormat = TextFormat.Text)
        {
            var emailMessage = CreateEmailMessage(message, textFormat);
            Send(emailMessage);
        }

        private void Send(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    client.Connect(_emailConfig.SmtpServer, _emailConfig.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(_emailConfig.UserName, _emailConfig.Password);
                    client.Send(mailMessage);
                }
                catch
                {
                    //log an error message or throw an exception or both.
                    throw;
                }
                finally
                {
                    client.Disconnect(true);
                    client.Dispose();
                }
            }
        }

        public async Task SendEmailAsync(EmailMessage message, TextFormat textFormat = TextFormat.Text)
        {
            var mailMessage = CreateEmailMessage(message, textFormat);

            await SendAsync(mailMessage);
        }

        private async Task SendAsync(MimeMessage mailMessage)
        {
            using (var client = new SmtpClient())
            {
                try
                {
                    await client.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, true);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    await client.AuthenticateAsync(_emailConfig.UserName, _emailConfig.Password);

                    await client.SendAsync(mailMessage);
                }
                catch
                {
                    //log an error message or throw an exception, or both.
                    throw;
                }
                finally
                {
                    await client.DisconnectAsync(true);
                    client.Dispose();
                }
            }
        }

        private MimeMessage CreateEmailMessage(EmailMessage message, TextFormat textFormat)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("email", _emailConfig.From));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;
            if (textFormat is TextFormat.Text)
            {
                emailMessage.Body = new TextPart(textFormat)
                {
                    Text = message.Content
                };
            }
            else
            {
                emailMessage.Body = new TextPart(textFormat)
                {
                    Text = message.Content
                };
            }

            return emailMessage;
        }
    }
}
