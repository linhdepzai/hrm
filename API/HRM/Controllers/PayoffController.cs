using CoreApiResponse;
using HRM.Data;
using HRM.DTOs.EmployeeDto;
using HRM.DTOs.NotificationDto;
using HRM.DTOs.PayoffDto;
using HRM.Entities;
using HRM.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/payoff")]
    public class PayoffController : BaseController
    {
        private readonly DataContext _dataContext;

        public PayoffController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getall/{id}")]
        public async Task<IActionResult> GetAll(Guid id)
        {
            var user = await _dataContext.Employee.FindAsync(id);
            var isAdmin = await _dataContext.Position.FirstOrDefaultAsync(i => i.Name == "Admin");
            var isAccoutant = await _dataContext.Position.FirstOrDefaultAsync(i => i.Name == "Accoutant");
            if (user.Position == isAdmin.Id || user.Position == isAccoutant.Id) return CustomResult(await _dataContext.Payoff.Where(i => i.IsDeleted == false).AsNoTracking().ToListAsync());
            var departments = await _dataContext.Department.Where(i => i.Boss == id).AsNoTracking().ToListAsync();
            var list = new List<Payoff>();
            foreach (var department in departments)
            {
                List<Payoff> data = await (from p in _dataContext.Payoff
                                           join e in _dataContext.Employee on p.EmployeeId equals e.Id
                                           where e.DepartmentId == department.Id && p.EmployeeId != id
                                           select p).AsNoTracking().ToListAsync();
                if (list.Any())
                {
                    foreach (var i in data)
                    {
                        list.Add(i);
                    }
                }
                else
                {
                    list = data;
                }
            }
            return CustomResult(list);
        }
        [HttpPost("Save")]
        public async Task<IActionResult> CreateOrEdit(CreateOrEditPayOffDto input)
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
        private async Task<IActionResult> Create(CreateOrEditPayOffDto input)
        {
            var newPayOff = new Payoff
            {
                Id = new Guid(),
                CreatorUserId = input.ActionId,
                EmployeeId = input.EmployeeId,
                Amount = input.Amount,
                Date = input.Date,
                Reason = input.Reason,
            };
            await _dataContext.Payoff.AddAsync(newPayOff);
            await _dataContext.SaveChangesAsync();
            return CustomResult(newPayOff);
        }
        private async Task<IActionResult> Update(CreateOrEditPayOffDto input)
        {
            var payoff = await _dataContext.Payoff.FindAsync(input.Id);
            if(payoff != null)
            {
                payoff.LastModifierUserId = input.ActionId;
                payoff.EmployeeId = input.EmployeeId;
                payoff.Amount = input.Amount;
                payoff.Date = input.Date;
                payoff.Reason = input.Reason;
            }
            _dataContext.Payoff.Update(payoff);
            await _dataContext.SaveChangesAsync();
            return CustomResult(payoff);
        }
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id, Guid payoffId)
        {
            var payoff = await _dataContext.Payoff.FindAsync(payoffId);
            payoff.DeleteUserId = id;
            _dataContext.Update(payoff);
            _dataContext.Payoff.Remove(payoff);
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }
    }
}
