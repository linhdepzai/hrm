using CoreApiResponse;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Database;
using Business.DTOs.NotificationDto;
using Entities;
using Business.DTOs.EmailDto;
using MimeKit.Text;
using System.Globalization;
using Business.Interfaces.IEmailServce;

namespace HRM.Controllers
{
    public class NotificationController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly IEmailSender _emailSender;

        public NotificationController(DataContext dataContext, IEmailSender emailSender)
        {
            _dataContext = dataContext;
            _emailSender = emailSender;
        }
        [HttpGet("getAll/{id}")]
        public async Task<IActionResult> GetAll(Guid id)
        {
            var notificationList = await (from n in _dataContext.Notification
                                          join e in _dataContext.NotificationEmployee
                                          on n.Id equals e.NotificationId
                                          where e.EmployeeId == id && e.IsDeleted == false && n.IsDeleted == false
                                          select new
                                          {
                                              Id = n.Id,
                                              Thumbnail = n.Thumbnail,
                                              Title = n.Title,
                                              CreateDate = n.CreateDate,
                                              IsRead = e.IsRead,
                                              CreateUserId = n.CreatorUserId,
                                              CreateUserName = _dataContext.Employee.FirstOrDefault(i => i.AppUserId == n.CreatorUserId).FullName,
                                              CreateUserPhoto = _dataContext.AppUser.FirstOrDefault(i => i.Id == n.CreatorUserId).AvatarUrl,
                                          }).AsNoTracking().ToListAsync();
            return CustomResult(notificationList);
        }
        [HttpGet("manage")]
        public async Task<IActionResult> Manage()
        {
            return CustomResult(await _dataContext.Notification.Where(i => i.IsDeleted == false && i.Type != "Salary").AsNoTracking().ToListAsync());
        }
        [HttpGet("getANotification/{id}")]
        public async Task<IActionResult> GetANotification(Guid id)
        {
            var employeeId = await (from e in _dataContext.NotificationEmployee
                                    where e.NotificationId == id && e.IsDeleted == false
                                    select new
                                    {
                                        EmployeeId = e.EmployeeId,
                                    }).AsNoTracking().ToListAsync();
            var result = await (from n in _dataContext.Notification
                                where n.Id == id
                                select new
                                {
                                    Id = n.Id,
                                    Thumbnail = n.Thumbnail,
                                    Title = n.Title,
                                    Content = n.Content,
                                    CreateDate = n.CreateDate,
                                    Employee = employeeId,
                                }).AsNoTracking().ToListAsync();
            return CustomResult(result);
        }
        [HttpGet("readNotification/{employeeId}")]
        public async Task<IActionResult> ReadNotification(Guid employeeId, Guid id)
        {
            var notification = await _dataContext.NotificationEmployee.FirstOrDefaultAsync(e => e.NotificationId == id && e.EmployeeId == employeeId && e.IsDeleted == false);
            if (notification != null)
            {
                notification.IsRead = true;
                _dataContext.NotificationEmployee.Update(notification);
                await _dataContext.SaveChangesAsync();
            };
            var month = _dataContext.Notification.FirstOrDefault(i => i.Id == id).CreateDate.Month;
            var salary = (from es in _dataContext.SalaryReport
                          join s in _dataContext.Salary on es.Salary equals s.Id
                          join e in _dataContext.Employee on es.UserId equals e.Id
                          where es.UserId == employeeId && es.Date.Month == month
                          select new
                          {
                              Id = es.Id,
                              Employee = e.FullName,
                              PositionId = s.PositionId,
                              Level = s.Level,
                              SalaryCode = s.SalaryCode,
                              Salary = s.Money,
                              Welfare = s.Welfare,
                              Workdays = es.TotalWorkdays,
                              Punish = es.Punish,
                              Bounty = es.Bounty,
                              ActualSalary = es.ActualSalary,
                              Date = es.Date,
                              IsConfirm = es.IsConfirm,
                          }).FirstOrDefault();
            var result = from n in _dataContext.Notification
                         where n.Id == id
                         select new
                         {
                             Id = n.Id,
                             Thumbnail = n.Thumbnail,
                             Title = n.Title,
                             Content = n.Content,
                             Type = n.Type,
                             CreateDate = n.CreateDate,
                             IsRead = notification.IsRead,
                             Salary = n.Type == "Salary" ? salary : null
                         };
            return CustomResult(result);
        }

        [HttpPost("save")]
        public async Task<IActionResult> CreateOrEdit(CreateOrEditNotificationDto input)
        {
            if (input.Id == null)
            {
                return await Create(input);
            }
            else
            {
                return await Update(input);
            }
        }
        private async Task<IActionResult> Create(CreateOrEditNotificationDto input)
        {
            var notification = new Notification
            {
                Id = new Guid(),
                Thumbnail = input.Thumbnail,
                Title = input.Title,
                Content = input.Content,
                Type = "General",
                CreateDate = DateTime.Now,
                CreatorUserId = input.ActionId,
            };
            await _dataContext.AddAsync(notification);
            foreach (var i in input.Employee)
            {
                var employee = new NotificationEmployee
                {
                    Id = new Guid(),
                    NotificationId = notification.Id,
                    EmployeeId = i.EmployeeId,
                    IsRead = false,
                };
                await _dataContext.AddAsync(employee);
            }
            if (await _dataContext.SaveChangesAsync() > 0)
            {
                foreach (var i in input.Employee)
                {
                    var email = await _dataContext.AppUser.FirstOrDefaultAsync(u => u.Id == i.EmployeeId);
                    var name = await _dataContext.Employee.FirstOrDefaultAsync(u => u.AppUserId == i.EmployeeId);
                    var mail = new SendNotificationToEmail
                    {
                        Email = email.Email,
                        Name = name.FullName,
                        Title = notification.Title,
                        Content = notification.Content,
                        CreateDate = notification.CreateDate,
                    };
                    await SendEmail(mail);
                }
            }
            var result = new
            {
                Id = notification.Id,
                Thumbnail = notification.Thumbnail,
                Title = notification.Title,
                Content = notification.Content,
                CreateDate = notification.CreateDate,
                Employee = input.Employee,
            };
            return CustomResult(result);
        }
        private async Task<IActionResult> Update(CreateOrEditNotificationDto input)
        {
            var notification = await _dataContext.Notification.FindAsync(input.Id);
            if (notification != null)
            {
                notification.Thumbnail = input.Thumbnail;
                notification.Title = input.Title;
                notification.Content = input.Content;
                notification.CreatorUserId = input.ActionId;
                _dataContext.Update(notification);
                var employee = await (from n in _dataContext.NotificationEmployee
                                      where n.NotificationId == input.Id && n.IsDeleted == false
                                      select new
                                      {
                                          EmployeeId = n.EmployeeId,
                                      }).AsNoTracking().ToListAsync();
                foreach (var i in input.Employee)
                {
                    var check = employee.Find(m => m.EmployeeId == i.EmployeeId);
                    if (check == null)
                    {
                        var newItem = new NotificationEmployee
                        {
                            Id = new Guid(),
                            NotificationId = (Guid)input.Id,
                            EmployeeId = i.EmployeeId,
                            IsRead = false,
                        };
                        _dataContext.NotificationEmployee.Update(newItem);
                    }
                };
                foreach (var i in employee)
                {
                    var check = input.Employee.Find(m => m.EmployeeId == i.EmployeeId);
                    if (check == null)
                    {
                        _dataContext.NotificationEmployee.Remove(
                            await _dataContext.NotificationEmployee.FirstOrDefaultAsync(n => n.NotificationId == input.Id && n.EmployeeId == i.EmployeeId && n.IsDeleted == false));
                    }
                }
            }
            await _dataContext.SaveChangesAsync();
            var result = new
            {
                Id = notification.Id,
                Thumbnail = notification.Thumbnail,
                Title = notification.Title,
                Content = notification.Content,
                CreateDate = notification.CreateDate,
                Employee = input.Employee,
            };
            return CustomResult(result);
        }
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id, Guid notificationId)
        {
            var notification = await _dataContext.Notification.FindAsync(notificationId);
            notification.DeleteUserId = id;
            _dataContext.Update(notification);
            _dataContext.Notification.Remove(notification);
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }
        private async Task SendEmail(SendNotificationToEmail input)
        {
            string head = @"
                <!DOCTYPE html>
                <html>
                <head>
                  <title>" + input.Title + @"</title>
                  <style>
                    body {
                      font-family: Arial, sans-serif;
                    }

                    .container {
                      width: 500px;
                      margin: 0 auto;
                      padding: 20px;
                      background-color: #f5f5f5;
                      border: 1px solid #ccc;
                      border-radius: 4px;
                    }

                    h1 {
                      text-align: center;
                      color: #333;
                    }

                    p {
                      margin-bottom: 20px;
                      line-height: 1.5;
                    }

                    .button {
                      display: inline-block;
                      padding: 10px 20px;
                      background-color: #fca311;
                      color: #242525;
                      text-decoration: none;
                      border-radius: 4px;
                    }
                  </style>
                </head>
            ";

            EmailMessage message = new(new string[] { input.Email! }, "[HRM] " + input.Title, head + $@"
                <body>
                  <div class=""container"">
                    <h1>{input.Title}</h1>
                    <p>Dear {input.Name} </p>
                    {input.Content}
                    <p>Sincerely,</p>
                    <p>The [Company Name] Team</p>
                    <div style=""text-align: center;"">
                      <a href=""[Company Website]"" class=""button"">Visit Our Website</a>
                    </div>
                  </div>
                </body>
                </html>
            ");

            await _emailSender.SendEmailAsync(message, TextFormat.Html);
        }
    }
}
