using Microsoft.AspNetCore.Mvc;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Database;
using Business.DTOs.TaskDto;
using Entities;
using Entities.Enum.Project;

namespace HRM.Controllers
{
    public class TaskController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public TaskController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("{userId}/get-all")]
        public async Task<ActionResult> GetAll(Guid userId)
        {
            var issueList = await (from i in _dataContext.Issue
                                   join p in _dataContext.Project on i.ProjectId equals p.Id
                                   join m in _dataContext.MemberProject on p.Id equals m.ProjectId
                                   where m.AppUserId == userId
                                   select i).AsNoTracking().ToListAsync();
            return Ok(issueList);
        }
        [HttpPost("{userId}/save")]
        public async Task<ActionResult> CreateOrEdit(CreateOrEditTaskDto input, Guid userId)
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
        private async Task<ActionResult> Create(CreateOrEditTaskDto input)
        {
            var task = await _dataContext.Issue.AsNoTracking().FirstOrDefaultAsync(e => e.ProjectId == input.ProjectId
                && e.TaskName.ToLower() == input.TaskName.ToLower());
            if (task != null) return BadRequest("TaskName was existed");
            var project = await _dataContext.Project.FindAsync(input.ProjectId);
            if (input.DeadlineDate.Date > project.DeadlineDate.Date)
            {
                return BadRequest("Task deadline date must less than or equal porject deadline date");
            }
            else
            {
                var newTask = new Issue
                {
                    Id = new Guid(),
                    TaskName = input.TaskName,
                    CreateUserId = input.CreateUserId,
                    CreateDate = DateTime.Now,
                    DeadlineDate = input.DeadlineDate,
                    PriorityCode = input.PriorityCode,
                    StatusCode = WorkStatus.Open,
                    Description = input.Description,
                    TaskType = input.TaskType,
                    TaskCode = input.TaskCode,
                    ProjectId = input.ProjectId,
                    UserId = input.EmployeeId
                };
                await _dataContext.Issue.AddAsync(newTask);
                await _dataContext.SaveChangesAsync();
                return Ok(newTask);
            }
        }
        private async Task<ActionResult> Update(CreateOrEditTaskDto input)
        {
            var task = await _dataContext.Issue.FindAsync(input.Id);
            if (task != null)
            {
                var project = await _dataContext.Project.FindAsync(input.ProjectId);
                if (input.DeadlineDate.Date > project.DeadlineDate.Date)
                {
                    return BadRequest("Task deadline date must less than or equal porject deadline date");
                } else
                {
                    task.TaskName = input.TaskName;
                    task.CreateUserId = input.CreateUserId;
                    task.DeadlineDate = input.DeadlineDate;
                    task.PriorityCode = input.PriorityCode;
                    task.StatusCode = WorkStatus.Open;
                    task.CompleteDate = input.CompleteDate;
                    task.Description = input.Description;
                    task.TaskType = input.TaskType;
                    task.TaskCode = input.TaskCode;
                    task.ProjectId = input.ProjectId;
                    task.UserId = input.EmployeeId;
                }
            };
            _dataContext.Issue.Update(task);
            await _dataContext.SaveChangesAsync();
            return Ok(task);
        }
        [HttpDelete("{userId}/delete")]
        public async Task<ActionResult> DeleteTask(Guid id, Guid userId)
        {
            _dataContext.Issue.Remove(await _dataContext.Issue.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return Ok("Removed");
        }
    }
}
