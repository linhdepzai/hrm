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
        [HttpGet("{userId}/get-all")]
        public async Task<IActionResult> GetAll(Guid userId)
        {
            var user = await _dataContext.Employee.FindAsync(userId);
            var isAdmin = await (from u in _dataContext.AppUserRole
                                 join r in _dataContext.AppRole on u.RoleId equals r.Id
                                 where u.UserId == userId && (r.Name == "Admin" || r.Name == "Accoutant")
                                 select new
                                 {
                                     Role = r.Name,
                                 }).AsNoTracking().ToListAsync();
            if (isAdmin.Count > 0) return CustomResult(await _dataContext.PayOff.Where(i => i.IsDeleted == false).AsNoTracking().ToListAsync());
            var departments = await _dataContext.Department.Where(i => i.Boss == userId).AsNoTracking().ToListAsync();
            var list = new List<PayOff>();
            foreach (var department in departments)
            {
                List<PayOff> data = await (from p in _dataContext.PayOff
                                           join e in _dataContext.Employee on p.UserId equals e.Id
                                           where e.DepartmentId == department.Id && p.UserId != userId
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
        [HttpPost("{userId}/Save")]
        public async Task<IActionResult> CreateOrEdit(CreateOrEditPayOffDto input, Guid userId)
        {
            if (input.Id == null)
            {
                return await Create(input, userId);
            }
            else
            {
                return await Update(input, userId);
            }
        }
        private async Task<IActionResult> Create(CreateOrEditPayOffDto input, Guid userId)
        {
            var newPayOff = new PayOff
            {
                Id = new Guid(),
                CreatorUserId = userId,
                UserId = input.UserId,
                Amount = input.Amount,
                Date = input.Date,
                Reason = input.Reason,
                Punish = input.Punish,
        };
            await _dataContext.PayOff.AddAsync(newPayOff);
            await _dataContext.SaveChangesAsync();
            return CustomResult(newPayOff);
        }
        private async Task<IActionResult> Update(CreateOrEditPayOffDto input, Guid userId)
        {
            var payoff = await _dataContext.PayOff.FindAsync(input.Id);
            if(payoff != null)
            {
                payoff.LastModifierUserId = userId;
                payoff.UserId = input.UserId;
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
        public async Task<IActionResult> Delete(Guid payoffId, Guid userId)
        {
            var payoff = await _dataContext.PayOff.FindAsync(payoffId);
            payoff.DeleteUserId = userId;
            _dataContext.Update(payoff);
            _dataContext.PayOff.Remove(payoff);
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }
    }
}
