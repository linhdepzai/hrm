using Business.DTOs.PayoffDto;
using CoreApiResponse;
using Database;
using Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HRM.Controllers
{
    public class PayoffController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly ISession _session;

        public PayoffController(DataContext dataContext, ISession session)
        {
            _dataContext = dataContext;
            _session = session;
        }
        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            Guid id = new Guid(_session.GetString("UserId"));
            var user = await _dataContext.Employee.FindAsync(id);
            var isAdmin = await _dataContext.Position.FirstOrDefaultAsync(i => i.Name == "Admin");
            var isAccoutant = await _dataContext.Position.FirstOrDefaultAsync(i => i.Name == "Accoutant");
            if (user.PositionId == isAdmin.Id || user.PositionId == isAccoutant.Id) return CustomResult(await _dataContext.PayOff.Where(i => i.IsDeleted == false).AsNoTracking().ToListAsync());
            var departments = await _dataContext.Department.Where(i => i.Boss == id).AsNoTracking().ToListAsync();
            var list = new List<PayOff>();
            foreach (var department in departments)
            {
                List<PayOff> data = await (from p in _dataContext.PayOff
                                           join e in _dataContext.Employee on p.UserId equals e.Id
                                           where e.DepartmentId == department.Id && p.UserId != id
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
            var newPayOff = new PayOff
            {
                Id = new Guid(),
                CreatorUserId = new Guid(_session.GetString("UserId")),
                UserId = input.EmployeeId,
                Amount = input.Amount,
                Date = input.Date,
                Reason = input.Reason,
                Punish = input.Punish,
        };
            await _dataContext.PayOff.AddAsync(newPayOff);
            await _dataContext.SaveChangesAsync();
            return CustomResult(newPayOff);
        }
        private async Task<IActionResult> Update(CreateOrEditPayOffDto input)
        {
            var payoff = await _dataContext.PayOff.FindAsync(input.Id);
            if(payoff != null)
            {
                payoff.LastModifierUserId = new Guid(_session.GetString("UserId"));
                payoff.UserId = input.EmployeeId;
                payoff.Amount = input.Amount;
                payoff.Date = input.Date;
                payoff.Reason = input.Reason;
                payoff.Punish = input.Punish;
            }
            _dataContext.PayOff.Update(payoff);
            await _dataContext.SaveChangesAsync();
            return CustomResult(payoff);
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(Guid payoffId)
        {
            var payoff = await _dataContext.PayOff.FindAsync(payoffId);
            payoff.DeleteUserId = new Guid(_session.GetString("UserId"));
            _dataContext.Update(payoff);
            _dataContext.PayOff.Remove(payoff);
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }
    }
}
