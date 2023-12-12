using Business.DTOs.AccountDto;
using Business.DTOs.JobDto;
using Database;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRM.Controllers
{
    public class JobController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public JobController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("get/{id}")]
        public async Task<IActionResult> Get(Guid id)
        {
            var job = await _dataContext.Job.Where(i => i.IsDeleted == false && i.Id == id).AsNoTracking().ToListAsync();
            return CustomResult(job);
        }

        [HttpGet("get-all")]
        public async Task<IActionResult> GetAllJob()
        {
            var jobs = await _dataContext.Job.Where(i => i.IsDeleted == false).AsNoTracking().ToListAsync();
            return CustomResult(jobs);
        }
        [HttpPost("{userId}/save")]
        public async Task<IActionResult> CreateOrEdit(CreateOrEditJobDto input, Guid userId)
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
        private async Task<IActionResult> Create(CreateOrEditJobDto input, Guid userId)
        {
            var newJob = new Job
            {
                Id = new Guid(),
                CreatorUserId = userId,
                JobTitle = input.JobTitle,
                PositionId = input.PositionId,
                Level = input.Level,
                Quantity = input.Quantity,
                FromDate = input.FromDate,
                ToDate = input.ToDate,
                SalaryRange = input.SalaryRange,
                Description = input.Description,
                Require = input.Require,
                Visible = input.Visible,
            };
            await _dataContext.Job.AddAsync(newJob);
            await _dataContext.SaveChangesAsync();
            return CustomResult(newJob);
        }
        private async Task<IActionResult> Update(CreateOrEditJobDto input, Guid userId)
        {
            var job = await _dataContext.Job.FindAsync(input.Id);
            if (job != null)
            {
                job.LastModifierUserId = userId;
                job.JobTitle = input.JobTitle;
                job.PositionId = input.PositionId;
                job.Level = input.Level;
                job.Quantity = input.Quantity;
                job.FromDate = input.FromDate;
                job.ToDate = input.ToDate;
                job.SalaryRange = input.SalaryRange;
                job.Description = input.Description;
                job.Require = input.Require;
                job.Visible = input.Visible;
            }
            _dataContext.Job.Update(job);
            await _dataContext.SaveChangesAsync();
            return CustomResult(job);
        }
        [HttpDelete("{userId}/delete")]
        public async Task<IActionResult> Delete(Guid jobId, Guid userId)
        {
            var job = await _dataContext.Job.FindAsync(jobId);
            job.DeleteUserId = userId;
            _dataContext.Update(job);
            _dataContext.Job.Remove(job);
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }
    }
}
