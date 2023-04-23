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
            var list = await _dataContext.TimeWorking.Where(i => i.Status == Status.Approved).AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpPost("requestChangeTimeWorking")]
        public async Task<IActionResult> RequestChangeWorkingTime(CreateOrEditTimeWorkingDto input)
        {
            var timeWorking = await _dataContext.TimeWorking.FirstOrDefaultAsync(i => i.EmployeeId == input.EmployeeId && i.Status == Status.Pending);
            if (timeWorking != null)
            {
                timeWorking.EmployeeId = input.EmployeeId;
                timeWorking.MorningStartTime = input.MorningStartTime;
                timeWorking.MorningEndTime = input.MorningEndTime;
                timeWorking.AfternoonStartTime = input.AfternoonStartTime;
                timeWorking.AfternoonEndTime = input.AfternoonEndTime;
                timeWorking.ApplyDate = input.ApplyDate;
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
                    MorningStartTime = input.MorningStartTime,
                    MorningEndTime = input.MorningEndTime,
                    AfternoonStartTime= input.AfternoonStartTime,
                    AfternoonEndTime= input.AfternoonEndTime,
                    ApplyDate = input.ApplyDate,
                    RequestDate = DateTime.Now,
                    Status = Status.Pending,
                };
                await _dataContext.TimeWorking.AddAsync(newTimeWorking);
                await _dataContext.SaveChangesAsync();
                return CustomResult(newTimeWorking);
            }
        }
        [HttpPut("updateStatus")]
        public async Task<IActionResult> UpdateStatus(UpdateStatusEmployeeDto input)
        {
            var employee = await _dataContext.Employee.FindAsync(input.Id);
            if (employee != null)
            {
                if (employee.Position != Position.PM)
                {
                    employee.Status = Status.Pending;
                }
                else
                {
                    employee.Status = input.Status;
                }
            };
            _dataContext.Employee.Update(employee);
            await _dataContext.SaveChangesAsync();
            return CustomResult(employee);
        }
    }
}
