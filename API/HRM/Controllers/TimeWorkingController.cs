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

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/timeworking")]
    public class TimeWorkingController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public TimeWorkingController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getAll")]
        public async Task<ActionResult> GetAll()
        {
            var list = await _dataContext.TimeWorking.Where(i => i.Status == Status.Approved).AsNoTracking().ToListAsync();
            return Ok(list);
        }
        [HttpGet("getAllRequestOff")]
        public async Task<ActionResult> GetAllRequestOff()
        {
            var list = await _dataContext.TimeWorking.Where(i => i.Status == Status.Pending).AsNoTracking().ToListAsync();
            return Ok(list);
        }
        [HttpPut("edit")]
        public async Task<ActionResult> Update(CreateOrEditTimeWorkingDto input)
        {
            var timeWorking = await _dataContext.TimeWorking.FindAsync(input.Id);
            if (timeWorking == null) return BadRequest("Error");
            if (timeWorking != null)
            {
                timeWorking.EmployeeId = input.EmployeeId;
                timeWorking.MorningStartTime = input.MorningStartTime;
                timeWorking.MorningEndTime = input.MorningEndTime;
                timeWorking.AfternoonStartTime = input.AfternoonStartTime;
                timeWorking.AfternoonEndTime = input.AfternoonEndTime;
                timeWorking.ApplyDate = input.ApplyDate;
                timeWorking.RequestDate = input.RequestDate;
                timeWorking.Status = Status.New;
            };
            _dataContext.TimeWorking.Update(timeWorking);
            await _dataContext.SaveChangesAsync();
            return Ok(timeWorking);
        }
        [HttpPut("updateStatus")]
        public async Task<ActionResult> UpdateStatus(UpdateStatusEmployeeDto input)
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
            return Ok(employee);
        }
    }
}
