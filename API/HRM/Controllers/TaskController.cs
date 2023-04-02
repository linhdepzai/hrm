using HRM.Data;
using HRM.Enum;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using HRM.DTOs.ProjectDto;
using HRM.Entities;
using HRM.DTOs.TaskDto;

namespace HRM.Controllers
{
    [Route("api/task")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public TaskController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpGet("getall")]
        public async Task<ActionResult> GetAll()
        {
            var taskList = _dataContext.Task.AsNoTracking().ToListAsync();
            return Ok(taskList);
        }
        [HttpPost("save")]
        public async Task<ActionResult> CreateOrEdit(CreateOrEditTaskDto input)
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
            var task = await _dataContext.Task.AsNoTracking().FirstOrDefaultAsync(e => e.ProjectId == input.ProjectId
                && e.TaskName.ToLower() == input.TaskName.ToLower());
            if (task != null) return BadRequest("TaskName was existed");
            var project = await _dataContext.Project.FindAsync(input.ProjectId);
            if (input.DeadlineDate.Date > project.DeadlineDate.Date)
            {
                return BadRequest("Task deadline date must less than or equal porject deadline date");
            }
            else
            {
                var newTask = new HRM.Entities.Task
                {
                    Id = new Guid(),
                    TaskName = input.TaskName,
                    CreateUserId = input.CreateUserId,
                    CreateDate = DateTime.Now,
                    DeadlineDate = input.DeadlineDate,
                    PriorityCode = input.PriorityCode,
                    StatusCode = Enum.StatusTask.Open,
                    Description = input.Description,
                    TaskType = input.TaskType,
                    TaskCode = input.TaskCode,
                    ProjectId = input.ProjectId,
                    EmployeeId = input.EmployeeId
                };
                await _dataContext.Task.AddAsync(newTask);
                await _dataContext.SaveChangesAsync();
                return Ok(newTask);
            }
        }
        private async Task<ActionResult> Update(CreateOrEditTaskDto input)
        {
            var task = await _dataContext.Task.FindAsync(input.Id);
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
                    task.StatusCode = Enum.StatusTask.Open;
                    task.CompleteDate = input.CompleteDate;
                    task.Description = input.Description;
                    task.TaskType = input.TaskType;
                    task.TaskCode = input.TaskCode;
                    task.ProjectId = input.ProjectId;
                    task.EmployeeId = input.EmployeeId;
                }
            };
            _dataContext.Task.Update(task);
            await _dataContext.SaveChangesAsync();
            return Ok(task);
        }
        [HttpDelete("delete")]
        public async Task<ActionResult> DeleteTask(Guid id)
        {
            _dataContext.Task.Remove(await _dataContext.Task.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return Ok("Removed");
        }
    }
}
