using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Linq;
using CoreApiResponse;
using Database;
using Business.DTOs.TimeWorkingDto;
using Entities;
using Entities.Enum;
using Entities.Enum.Record;
using Microsoft.AspNetCore.Http;

namespace HRM.Controllers
{
    public class TimeWorkingController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public TimeWorkingController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("{userId}/get-all")]
        public async Task<IActionResult> GetAll(Guid userId)
        {
            var list = await _dataContext.TimeWorking.AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpPost("{userId}/request-change-timeWorking")]
        public async Task<IActionResult> RequestChangeWorkingTime(Guid userId, CreateOrEditTimeWorkingDto input)
        {
            var timeWorking = await _dataContext.TimeWorking.FirstOrDefaultAsync(i => i.UserId == userId && i.Status == RecordStatus.Pending);
            if (timeWorking != null)
            {
                timeWorking.UserId = userId;
                timeWorking.MorningStartTime = input.MorningStartTime.AddHours(7);
                timeWorking.MorningEndTime = input.MorningEndTime.AddHours(7);
                timeWorking.AfternoonStartTime = input.AfternoonStartTime.AddHours(7);
                timeWorking.AfternoonEndTime = input.AfternoonEndTime.AddHours(7);
                timeWorking.ApplyDate = input.ApplyDate.AddHours(7);
                timeWorking.RequestDate = DateTime.Now;
                timeWorking.Status = RecordStatus.Pending;
                timeWorking.LastModifierUserId = userId;
                _dataContext.TimeWorking.Update(timeWorking);
                await _dataContext.SaveChangesAsync();
                return CustomResult(timeWorking);
            }
            else
            {
                var newTimeWorking = new TimeWorking
                {
                    Id = new Guid(),
                    UserId = userId,
                    MorningStartTime = input.MorningStartTime.AddHours(7),
                    MorningEndTime = input.MorningEndTime.AddHours(7),
                    AfternoonStartTime = input.AfternoonStartTime.AddHours(7),
                    AfternoonEndTime = input.AfternoonEndTime.AddHours(7),
                    ApplyDate = input.ApplyDate.AddHours(7),
                    RequestDate = DateTime.Now,
                    Status = RecordStatus.Pending,
                    CreatorUserId = userId,
                };
                await _dataContext.TimeWorking.AddAsync(newTimeWorking);
                await _dataContext.SaveChangesAsync();
                return CustomResult(newTimeWorking);
            }
        }
        [HttpPut("{userId}/update-status")]
        public async Task<IActionResult> UpdateStatus(Guid userId, UpdateStatusTimeWorkingDto input)
        {
            var timeWorking = await _dataContext.TimeWorking.FindAsync(input.Id);
            if (timeWorking != null)
            {
                timeWorking.Status = input.Status;
                string applyDate = timeWorking.ApplyDate.ToString();
                string today = DateTime.Now.ToString();
                if (input.Status == RecordStatus.Approved && DateTime.Compare(DateTime.Parse(applyDate), DateTime.Parse(today)) < 0)
                {
                    timeWorking.ApplyDate = DateTime.Now;
                }
                timeWorking.LastModifierUserId = userId;
            };
            _dataContext.TimeWorking.Update(timeWorking);
            await _dataContext.SaveChangesAsync();
            return CustomResult(timeWorking);
        }
    }
}
