using Business.DTOs.SalaryDto;
using CoreApiResponse;
using Database;
using Entities;
using Entities.Enum.Record;
using Entities.Enum.User;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace HRM.Controllers
{
    public class SalaryController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public SalaryController(DataContext dataContext)
        {
            _dataContext = dataContext;
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
                SalaryCode = Random(input),
                Level = input.Level,
                PositionId = input.PositionId,
                Money = input.Money,
                Welfare = input.Welfare,
            };
            await _dataContext.AddAsync(salary);
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
                    EmployeeId = i.EmployeeId,
                    IsRead = false,
                    CreatorUserId = userId,
                };
                await _dataContext.AddAsync(employee);
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
            if (salary != null)
            {
                salary.IsConfirm = confirm;
                salary.LastModifierUserId = userId;
                _dataContext.SalaryReport.Update(salary);
                await _dataContext.SaveChangesAsync();
            }
            return CustomResult(salary);
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
        public static string Random(CreateSalaryDto input)
        {
            string randomStr = "0" + input.PositionId;
            switch (input.Level)
            {
                case Level.Intern:
                    randomStr += "01";
                    break;
                case Level.Fresher:
                    randomStr += "02";
                    break;
                case Level.Middle:
                    randomStr += "03";
                    break;
                case Level.Junior:
                    randomStr += "04";
                    break;
                case Level.Senior:
                    randomStr += "05";
                    break;
            }
            randomStr += DateTime.Now.ToString("MM");
            randomStr += DateTime.Now.ToString("yy");
            try
            {
                int[] myIntArray = new int[4];
                int x;
                //that is to create the random # and add it to uour string
                Random autoRand = new Random();
                for (x = 0; x < 4; x++)
                {
                    myIntArray[x] = System.Convert.ToInt32(autoRand.Next(0, 9));
                    randomStr += (myIntArray[x].ToString());
                }
            }
            catch (Exception ex)
            {
                randomStr = "error";
            }
            return randomStr;
        }

    }
}
