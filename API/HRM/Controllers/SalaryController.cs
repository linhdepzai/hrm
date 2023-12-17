using Business.DTOs.EmailDto;
using Business.DTOs.NotificationDto;
using Business.DTOs.SalaryDto;
using Business.Interfaces.IEmailServce;
using CoreApiResponse;
using Database;
using Entities;
using Entities.Enum.Record;
using Entities.Enum.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MimeKit.Text;
using System.Globalization;

namespace HRM.Controllers
{
    public class SalaryController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly IEmailSender _emailSender;

        public SalaryController(DataContext dataContext, IEmailSender emailSender)
        {
            _dataContext = dataContext;
            _emailSender = emailSender;
        }
        [HttpGet("{userId}/get-all")]
        public async Task<IActionResult> GetAll(Guid userId)
        {
            var list = await _dataContext.Salary.AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpGet("{userId}/get-all-salary-for-employee")]
        public async Task<IActionResult> GetAllSalaryForEmployee(int month, int year, Guid userId)
        {
            var userList = await _dataContext.SalaryReport.Where(i => i.Date.Month - 1 == month && i.Date.Year == year).AsNoTracking().ToListAsync();
            return CustomResult(userList);
        }
        [HttpPost("{userId}/create")]
        public async Task<IActionResult> Create(CreateSalaryDto input, Guid userId)
        {
            var salary = new Salary
            {
                Id = new Guid(),
                CreatorUserId = userId,
                SalaryCode = Random(input.PositionId),
                Level = input.Level,
                PositionId = input.PositionId,
                Money = input.Money,
                Welfare = input.Welfare,
            };
            await _dataContext.AddAsync(salary);
            if(input.Synchronized == true) {
                var employee = await _dataContext.Employee.Where(i => i.Level == input.Level && i.PositionId == input.PositionId).AsNoTracking().ToListAsync();
                if(employee != null)
                {
                    foreach(var i in employee)
                    {
                        var se = await _dataContext.EmployeeSalary.FirstOrDefaultAsync(s => s.AppUserId == i.AppUserId);
                        se.SalaryId = salary.Id;
                        _dataContext.Update(se);
                    }
                }
            }
            await _dataContext.SaveChangesAsync();
            return CustomResult(salary);
        }
        [HttpPut("{userId}/update")]
        public async Task<IActionResult> Update(UpdateSalaryDto input, Guid userId)
        {
            var sal = await _dataContext.Salary.FirstOrDefaultAsync(i => i.Id == input.Salary);
            var salary = await _dataContext.SalaryReport.FindAsync(input.Id);
            if (salary != null)
            {
                salary.LastModifierUserId = userId;
                salary.Salary = input.Salary;
                salary.Date = DateTime.Now;
                salary.TotalWorkdays = input.TotalWorkdays;
                salary.Punish = input.Punish;
                salary.Bounty = input.Bounty;
                salary.IsConfirm = ConfirmStatus.New;
                salary.ActualSalary = sal.Money + sal.Welfare + input.Bounty - input.Punish;
                _dataContext.Update(salary);
            }
            await _dataContext.SaveChangesAsync();
            return CustomResult(salary);
        }
        [HttpPost("{userId}/send-notification-salary")]
        public async Task<IActionResult> SendNotificationSalary(SendNotificationSalaryDto input, Guid userId)
        {
            var notification = new Notification
            {
                Id = new Guid(),
                Thumbnail = "https://pyjamahr.com/wp-content/uploads/2022/03/WhatsApp-Image-2022-03-03-at-12.39.41.jpeg",
                Title = "Notice of salary statistics for the month of " + CultureInfo.CurrentCulture.DateTimeFormat.GetAbbreviatedMonthName(input.Month),
                Content = "",
                Type = "Salary",
                CreateDate = DateTime.Now,
                CreatorUserId = userId,
            };
            await _dataContext.Notification.AddAsync(notification);
            foreach (var i in input.Employee)
            {
                var employee = new NotificationEmployee
                {
                    Id = new Guid(),
                    NotificationId = notification.Id,
                    EmployeeId = i.UserId,
                    IsRead = false,
                    CreatorUserId = userId,
                };
                await _dataContext.AddAsync(employee);
                var emp = await _dataContext.Employee.FirstOrDefaultAsync(u => u.AppUserId == i.UserId && u.IsDeleted == false);
                var rpt = await _dataContext.SalaryReport.FirstOrDefaultAsync(s => s.UserId == i.UserId && s.CreationTime.Value.Month == notification.CreateDate.Month);
                var sal = await (from s in _dataContext.Salary
                                 join se in _dataContext.EmployeeSalary on s.Id equals se.SalaryId
                                 where se.AppUserId == i.UserId
                                 select s).FirstOrDefaultAsync();
                SendSalaryToEmail mail = new SendSalaryToEmail
                {
                    Id = rpt.Id,
                    Email = _dataContext.AppUser.FirstOrDefault(u => u.Id == i.UserId).Email,
                    Name = emp.FullName,
                    Title = notification.Title,
                    CreateDate = notification.CreateDate,
                    Position = _dataContext.Position.FirstOrDefault(u => u.Id == emp.PositionId).Name,
                    Level = getLevelName(emp.Level),
                    SalaryCode = sal.SalaryCode,
                    Salary = sal.Money.ToString("#,###", CultureInfo.GetCultureInfo("vi-VN").NumberFormat),
                    Welfare = sal.Welfare.ToString("#,###", CultureInfo.GetCultureInfo("vi-VN").NumberFormat),
                    Workdays = rpt.TotalWorkdays.ToString(),
                    Punish = rpt.Punish == 0 ? "0" : rpt.Punish.ToString("#,###", CultureInfo.GetCultureInfo("vi-VN").NumberFormat),
                    Bonus = rpt.Bounty == 0 ? "0" : rpt.Bounty.ToString("#,###", CultureInfo.GetCultureInfo("vi-VN").NumberFormat),
                    Total = rpt.ActualSalary.ToString("#,###", CultureInfo.GetCultureInfo("vi-VN").NumberFormat),
                };
                await SendEmail(mail);
            }
            await _dataContext.SaveChangesAsync();
            
            var result = new
            {
                Id = notification.Id,
                Thumbnail = notification.Thumbnail,
                Title = notification.Title,
                Content = notification.Content,
                CreateDate = notification.CreateDate,
            };
            return CustomResult(result);
        }
        [HttpPut("{userId}/confirm-salary")]
        public async Task<IActionResult> ConfirmSalary(Guid salaryId, ConfirmStatus confirm, Guid userId)
        {
            var salary = await _dataContext.SalaryReport.FindAsync(salaryId);
            if (salary != null && salary.IsConfirm == ConfirmStatus.New)
            {
                salary.IsConfirm = confirm;
                salary.LastModifierUserId = userId;
                _dataContext.SalaryReport.Update(salary);
                await _dataContext.SaveChangesAsync();
                var noti = confirm == ConfirmStatus.Confirm ? "Successfully!" : "Inbox with the accountant to solve the problem!";
                return CustomResult(noti,salary,System.Net.HttpStatusCode.OK);
            }
            return CustomResult("You have confirmed this notice!");
        }
        [HttpGet("{userId}/get-salary-for-employee")]
        public async Task<IActionResult> GetSalaryForEmployee(Guid userId)
        {
            var list = await (from s in _dataContext.EmployeeSalary
                              join e in _dataContext.Employee on s.AppUserId equals e.AppUserId
                              where e.IsDeleted == false
                              select s).AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpPut("{userId}/update-salary-for-employee/{employeeId}")]
        public async Task<IActionResult> UpdateSalaryForEmployee(Guid employeeId, Guid salaryId, Guid userId)
        {
            var salary = await _dataContext.EmployeeSalary.FirstOrDefaultAsync(i => i.AppUserId == employeeId);
            if (salary != null)
            {
                salary.SalaryId = salaryId;
                salary.LastModifierUserId = userId;
                _dataContext.EmployeeSalary.Update(salary);
                await _dataContext.SaveChangesAsync();
            }
            return CustomResult(salary);
        }
        private string Random(Guid input)
        {
            string posName = _dataContext.Position.FirstOrDefault(i => i.Id == input).Name;
            string randomStr = "";
            switch (posName)
            {
                case "BA":
                    randomStr += "BA";
                    break;
                case "Admin":
                    randomStr += "ADM";
                    break;
                case "PM":
                    randomStr += "PM";
                    break;
                case "Accountant":
                    randomStr += "ACT";
                    break;
                case "ScrumMaster":
                    randomStr += "SMT";
                    break;
                case "DevOps":
                    randomStr += "DOP";
                    break;
                case "QA":
                    randomStr += "QA";
                    break;
                case "DataEngineer":
                    randomStr += "DE";
                    break;
                case "Dev":
                    randomStr += "DEV";
                    break;
            }
            randomStr += "-";
            string sal = _dataContext.Salary.Where(s => s.SalaryCode.Contains(randomStr)).OrderByDescending(od => od.SalaryCode).FirstOrDefault().SalaryCode;
            int seq = Int32.Parse(sal.Substring(sal.Length - 2)) + 1;
            randomStr += seq.ToString().Length == 1 ? "0" + seq : seq;
            return randomStr;
        }

        private async Task SendEmail(SendSalaryToEmail input)
        {
            string head = $@"
                <!DOCTYPE html>
                <html>
                <head>
                    <title>[HRM]{input.Title}</title>";
            head += @"
                    <style>
                        .empName {
    	                    width: 100%;
                            background-color: #4fc1cc;
                            color: #ffffff;
                            font-size: x-large;
                            padding: 10px;
                        }  
    
                        .ant-row {
    	                    display: flex;
    	                    flex-flow: row wrap;
                            width: 100%;
                        }
    
                        .ant-col {
    	                    position: relative;
    	                    display: block;
    	                    flex: 0 0 50%;
    	                    width: 50%;
	                    }

                        .total-item {
                            border-top: 2px solid #000;
                        }

                        .total-value {
                            font-size: xx-large;
                            font-weight: bold;
                            color: #4fc1cc;
                        }

                        .ant-btn {
    	                    text-shadow: 0 -1px 0 rgba(0,0,0,.12);
    	                    box-shadow: 0 2px #0000000b;
                            line-height: 22px;
    	                    position: relative;
    	                    display: inline-block;
    	                    font-weight: 400;
    	                    white-space: nowrap;
    	                    text-align: center;
    	                    border: 1px solid transparent;
    	                    cursor: pointer;
    	                    transition: all .3s cubic-bezier(.645,.045,.355,1);
    	                    user-select: none;
    	                    touch-action: manipulation;
    	                    height: 22px;
    	                    padding: 4px 15px;
    	                    font-size: 14px;
                        	border-radius: 2px;
    	                    color: #fff;
                            width: 100px;
	                    }

                        .primary {
    	                    border-color: #4fc1cc;
    	                    background: #4fc1cc;
                        }

                        .danger {
                            border-color: #ff7875;
    	                    background: #ff7875;
                        }

                        .item {
                            font-size: medium;
                        }
                    </style>
                </head>
            ";

            EmailMessage message = new(new string[] { input.Email! }, "[HRM] " + input.Title, head + $@"
                <body>
                    <img height=""300"" width=""100%"" src=""https://pyjamahr.com/wp-content/uploads/2022/03/WhatsApp-Image-2022-03-03-at-12.39.41.jpeg"">
                    <h2 style=""font-weight: bold"">{input.Title}</h2>
                    <div>13/12/2023</div>
                    <div class=""empName"">Employee: 
	                    <span style=""font-weight: bold"">{input.Name}</span>
                    </div>
                    <div class=""ant-row"">
	                    <div class=""ant-col"">
                            <div class=""item"">
    	                        <span>Position: </span>
                                <span style=""font-weight: bold"">{input.Position}</span>
                            </div>
                            <div class=""item"">
                                <span>Level: </span>
                                <span style=""font-weight: bold"">{input.Level}</span>
                            </div>
                        </div>
                        <div class=""ant-col"">
    	                    <div class=""item"">
                                <span>Salary Code: </span>
                                <span style=""font-weight: bold"">{input.SalaryCode}</span>
                            </div>
                            <div class=""item"">
                                <span>Salary: </span>
                                <span style=""font-weight: bold"">{input.Salary} VND</span>
                            </div>
                            <div class=""item"">
                                <span>Welfare: </span>
                                <span style=""font-weight: bold"">{input.Welfare} VND</span>
                            </div>
                            <div class=""item"">
                                <span>Workdays: </span>
                                <span style=""font-weight: bold"">{input.Workdays}</span>
                            </div>
                            <div class=""item"">
                                <span>Punish: </span>
                                <span style=""font-weight: bold"">{input.Punish} VND</span>
                            </div>
                            <div class=""item"">
                                <span>Bonus: </span>
                                <span style=""font-weight: bold"">{input.Bonus} VND</span>
                            </div>
                        </div>
                    </div>
                    <div class=""item total-item"">
                        <span style=""font-weight: bold"">Total: </span>
                        <span class=""total-value"">{input.Total}</span>
                    </div>
                    <div style=""text-align: right; padding-bottom: 30px;"">
                        <a type=""button"" href=""http://localhost:4200/member/confirm?action=3&id={input.Id}"" class=""ant-btn danger"">
                            <i class=""fa-solid fa-xmark mr-5""></i>
                            <span>Complain</span>
                        </a>
                        <a type=""button"" href=""http://localhost:4200/member/confirm?action=2&id={input.Id}"" class=""ant-btn primary"">
                            <i class=""fa-solid fa-check mr-5""></i>
                            <span>Confirm</span>
                        </a>
                    </div>
                </body>
            </html>
            ");

            await _emailSender.SendEmailAsync(message, TextFormat.Html);
        }

        private static string getLevelName(Level id)
        {
            switch (id)
            {
                case Level.Intern:
                    return "Intern";
                case Level.Fresher:
                    return "Fresher";
                case Level.Junior:
                    return "Junior";
                case Level.Middle:
                    return "Middle";
                case Level.Senior:
                    return "Senior";
            }
            return "";
        }
    }
}
