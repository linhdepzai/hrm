using CoreApiResponse;
using HRM.Data;
using HRM.DTOs.EmployeeDto;
using HRM.DTOs.PayoffDto;
using HRM.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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
        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _dataContext.Payoff.AsNoTracking().ToListAsync();
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
        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(Guid id)
        {
            _dataContext.Department.Remove(await _dataContext.Department.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }
    }
}
