using Dapper;
using HRM.Data;
using HRM.Enum;
using HRM.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using HRM.DTOs.ProjectDto;
using HRM.Entities;
using HRM.DTOs.EmployeeDto;

namespace HRM.Controllers
{
    [Route("api/project")]
    [ApiController]
    public class ProjectController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public ProjectController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getall")]
        public async Task<ActionResult<List<GetAllProjectDto>>> GetAllProject()
        {
            var projectList = await (from p in _dataContext.Project
                                     join m in _dataContext.MemberProject on p.Id equals m.ProjectId
                                     join e in _dataContext.Employee on m.EmployeeId equals e.Id
                                     where m.Type == MemberType.ProjectManager
                                     select new GetAllProjectDto
                                     {
                                         Id = p.Id,
                                         ProjectName = p.ProjectName,
                                         Description = p.Description,
                                         ProjectType = p.ProjectType,
                                         ProjectCode = p.ProjectCode,
                                         CreateDate = p.CreateDate,
                                         DeadlineDate = p.DeadlineDate,
                                         CompleteDate = p.CompleteDate,
                                         PriorityCode = p.PriorityCode,
                                         StatusCode = p.StatusCode,
                                         Pm = e.FullName,
                                     }).AsNoTracking().ToListAsync();
            return Ok(projectList);
        }
        [HttpGet("getAProject")]
        public async Task<ActionResult<CreateOrEditProjectDto>> GetAProject(Guid projectId)
        {
            var member = await (from p in _dataContext.Project
                                join m in _dataContext.MemberProject on p.Id equals m.ProjectId
                                join e in _dataContext.Employee on m.EmployeeId equals e.Id
                                where p.Id == projectId
                                select new AddMemberToProjectDto
                                {
                                    EmployeeId = m.EmployeeId,
                                    Type = m.Type,
                                }).AsNoTracking().ToListAsync();
            var project = await _dataContext.Project.FirstOrDefaultAsync(e => e.Id == projectId); 
            return new CreateOrEditProjectDto
            {
                Id = project.Id,
                ProjectName = project.ProjectName,
                Description = project.Description,
                ProjectType = project.ProjectType,
                ProjectCode = project.ProjectCode,
                DeadlineDate = project.DeadlineDate,
                PriorityCode = project.PriorityCode,
                StatusCode = project.StatusCode,
                Members = member,
            };
        }
        [HttpPost("save")]
        public async Task<ActionResult> CreateOrEdit(CreateOrEditProjectDto input)
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
        private async Task<ActionResult> Create(CreateOrEditProjectDto input)
        {
            var projectNameNull = string.IsNullOrWhiteSpace(input.ProjectName);
            if (projectNameNull) return BadRequest("ProjectName not null");
            var project = await _dataContext.Project.FirstOrDefaultAsync(e => e.ProjectName == input.ProjectName);
            if (project != null) return BadRequest("ProjectName is taken");
            var data = new Project
            {
                Id = new Guid(),
                ProjectName = input.ProjectName,
                Description = input.Description,
                ProjectCode = input.ProjectCode,
                ProjectType = input.ProjectType,
                CreateDate = DateTime.Now,
                DeadlineDate = input.DeadlineDate,
                PriorityCode = input.PriorityCode,
                StatusCode = Enum.StatusTask.Open,
            };
            await _dataContext.Project.AddAsync(data);
            foreach (var i in input.Members)
            {
                var member = new MemberProject
                {
                    Id = new Guid(),
                    ProjectId = data.Id,
                    EmployeeId = i.EmployeeId,
                    Type = i.Type,
                };
                await _dataContext.MemberProject.AddAsync(member);
            }
            await _dataContext.SaveChangesAsync();
            return Ok(data);
        }
        private async Task<ActionResult> Update(CreateOrEditProjectDto input)
        {
            var project = await _dataContext.Project.FindAsync(input.Id);
            if (project != null)
            {
                project.ProjectName = input.ProjectName;
                project.Description = input.Description;
                project.ProjectCode = input.ProjectCode;
                project.ProjectType = input.ProjectType;
                project.DeadlineDate = input.DeadlineDate;
                project.PriorityCode = input.PriorityCode;
                project.StatusCode = input.StatusCode;
            };
            _dataContext.Project.Update(project);
            var member = await (from m in _dataContext.MemberProject
                                where m.ProjectId == input.Id
                                select new
                                {
                                    EmployeeId = m.EmployeeId,
                                    Type = m.Type,
                                }).AsNoTracking().ToListAsync();
            foreach (var i in input.Members)
            {
                var checkMember = member.Find(m => m.EmployeeId == i.EmployeeId);
                if (checkMember == null)
                {
                    var newMember = new MemberProject
                    {
                        Id = new Guid(),
                        ProjectId = (Guid)input.Id,
                        EmployeeId = i.EmployeeId,
                        Type = i.Type,
                    };
                    _dataContext.MemberProject.Update(newMember);
                }
            };
            foreach (var i in member)
            {
                var checkMember = input.Members.Find(m => m.EmployeeId == i.EmployeeId);
                if (checkMember == null)
                {
                    _dataContext.MemberProject.Remove(await _dataContext.MemberProject.FirstOrDefaultAsync(m => m.ProjectId == input.Id && m.EmployeeId == i.EmployeeId));
                }
                else
                {
                    var memberProject = await _dataContext.MemberProject.AsNoTracking().FirstOrDefaultAsync(e => e.ProjectId == input.Id && e.EmployeeId == i.EmployeeId);
                    if (memberProject != null)
                    {
                        memberProject.EmployeeId = i.EmployeeId;
                        memberProject.Type = i.Type;
                        _dataContext.MemberProject.Update(memberProject);
                    }
                }
            }
            await _dataContext.SaveChangesAsync();
            return Ok(project);
        }
        [HttpDelete("delete")]
        public async Task<ActionResult> DeleteProject(Guid id)
        {
            _dataContext.Task.RemoveRange(await _dataContext.Task.Where(e => e.ProjectId == id).ToListAsync());
            await _dataContext.SaveChangesAsync();
            _dataContext.Project.Remove(await _dataContext.Project.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return Ok("Removed");
        }
    }
}
