using CoreApiResponse;
using HRM.Data;
using HRM.DTOs.EmployeeDto;
using HRM.DTOs.SalaryDto;
using HRM.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/salary")]
    public class SalaryController : BaseController
    {
        private readonly DataContext _dataContext;

        public SalaryController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _dataContext.Salary.AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpGet("getAllSalaryForEmployee")]
        public async Task<IActionResult> GetAllSalaryForEmployee()
        {
            var userList = await _dataContext.EmployeeSalary.AsNoTracking().ToListAsync();
            return CustomResult(userList);
        }
        [HttpPost("create")]
        public async Task<IActionResult> Create(CreateSalaryDto input)
        {
            var salary = new Salary
            {
                Id = new System.Guid(),
                CreatorUserId = input.ActionId,
                SalaryCode = Random(input),
                Level = input.Level,
                Position = input.Position,
                Money = input.Money,
                Welfare = input.Welfare,
            };
            await _dataContext.AddAsync(salary);
            await _dataContext.SaveChangesAsync();
            return CustomResult(salary);
        }
        [HttpPut("update")]
        public async Task<IActionResult> Update(UpdateSalaryDto input)
        {
            var salary = await _dataContext.EmployeeSalary.FindAsync(input.Id);
            if (salary != null)
            {
                salary.LastModifierUserId = input.ActionId;
                salary.Salary = input.Salary;
                salary.Date = input.Date;
                salary.TotalWorkdays = input.TotalWorkdays;
                salary.Punish = input.Punish;
                salary.Bounty = input.Bounty;
                salary.ActualSalary = input.ActualSalary;
            }
            _dataContext.Update(salary);
            await _dataContext.SaveChangesAsync();
            return CustomResult(salary);
        }
        public static string Random(CreateSalaryDto input)
        {
            string randomStr = "0" + input.Position;
            switch (input.Level)
            {
                case Enum.Level.Intern:
                    randomStr += "01";
                    break;
                case Enum.Level.Fresher:
                    randomStr += "02";
                    break;
                case Enum.Level.Middle:
                    randomStr += "03";
                    break;
                case Enum.Level.Junior:
                    randomStr += "04";
                    break;
                case Enum.Level.Senior:
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
