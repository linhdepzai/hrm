using HRM.Data;
using HRM.DTOs.EmployeeDto;
using HRM.Entities;
using HRM.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Linq;
using HRM.DTOs.TimeWorkingDto;
using HRM.DTOs.OnLeaveDto;
using CoreApiResponse;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/timeworking")]
    public class TimeWorkingController : BaseController
    {
        private readonly DataContext _dataContext;

        public TimeWorkingController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _dataContext.TimeWorking.AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpPost("requestChangeTimeWorking")]
        public async Task<IActionResult> RequestChangeWorkingTime(CreateOrEditTimeWorkingDto input)
        {
            var timeWorking = await _dataContext.TimeWorking.FirstOrDefaultAsync(i => i.EmployeeId == input.EmployeeId && i.Status == Status.Pending);
            if (timeWorking != null)
            {
                timeWorking.EmployeeId = input.EmployeeId;
                timeWorking.MorningStartTime = input.MorningStartTime.AddHours(7);
                timeWorking.MorningEndTime = input.MorningEndTime.AddHours(7);
                timeWorking.AfternoonStartTime = input.AfternoonStartTime.AddHours(7);
                timeWorking.AfternoonEndTime = input.AfternoonEndTime.AddHours(7);
                timeWorking.ApplyDate = input.ApplyDate.AddHours(7);
                timeWorking.RequestDate = DateTime.Now;
                timeWorking.Status = Status.Pending;
                _dataContext.TimeWorking.Update(timeWorking);
                await _dataContext.SaveChangesAsync();
                return CustomResult(timeWorking);
            }
            else
            {
                var newTimeWorking = new TimeWorking
                {
                    Id = new Guid(),
                    EmployeeId = input.EmployeeId,
                    MorningStartTime = input.MorningStartTime.AddHours(7),
                    MorningEndTime = input.MorningEndTime.AddHours(7),
                    AfternoonStartTime = input.AfternoonStartTime.AddHours(7),
                    AfternoonEndTime = input.AfternoonEndTime.AddHours(7),
                    ApplyDate = input.ApplyDate.AddHours(7),
                    RequestDate = DateTime.Now,
                    Status = Status.Pending,
                };
                await _dataContext.TimeWorking.AddAsync(newTimeWorking);
                await _dataContext.SaveChangesAsync();
                return CustomResult(newTimeWorking);
            }
        }
        [HttpPut("updateStatus")]
        public async Task<IActionResult> UpdateStatus(UpdateStatusTimeWorkingDto input)
        {
            var timeWorking = await _dataContext.TimeWorking.FindAsync(input.Id);
            if (timeWorking != null)
            {
                timeWorking.Status = input.Status;
                string applyDate = timeWorking.ApplyDate.ToString();
                string today = DateTime.Now.ToString();
                if (input.Status == Status.Approved && DateTime.Compare(DateTime.Parse(applyDate), DateTime.Parse(today)) < 0)
                {
                    timeWorking.ApplyDate = DateTime.Now;
                }
            };
            _dataContext.TimeWorking.Update(timeWorking);
            await _dataContext.SaveChangesAsync();
            return CustomResult(timeWorking);
        }
    }
}
