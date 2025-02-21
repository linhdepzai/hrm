﻿using Dapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using CoreApiResponse;
using Database;
using Entities.Enum;
using Business.DTOs.ProjectDto;
using Entities;
using Entities.Enum.Project;

namespace HRM.Controllers
{
    public class ProjectController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public ProjectController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getall")]
        public async Task<IActionResult> GetAllProject()
        {
            var projectList = await (from p in _dataContext.Project
                                     join m in _dataContext.MemberProject on p.Id equals m.ProjectId
                                     join e in _dataContext.Employee on m.AppUserId equals e.AppUserId
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
            return CustomResult(projectList);
        }
        [HttpGet("getAProject")]
        public async Task<IActionResult> GetAProject(Guid projectId)
        {
            var member = await (from p in _dataContext.Project
                                join m in _dataContext.MemberProject on p.Id equals m.ProjectId
                                join e in _dataContext.Employee on m.AppUserId equals e.AppUserId
                                where p.Id == projectId
                                select new AddMemberToProjectDto
                                {
                                    EmployeeId = m.AppUserId,
                                    Type = m.Type,
                                }).AsNoTracking().ToListAsync();
            var project = await _dataContext.Project.FirstOrDefaultAsync(e => e.Id == projectId); 
            return CustomResult(new CreateOrEditProjectDto
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
            });
        }
        [HttpPost("save")]
        public async Task<IActionResult> CreateOrEdit(CreateOrEditProjectDto input)
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
        private async Task<IActionResult> Create(CreateOrEditProjectDto input)
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
                StatusCode = WorkStatus.Open,
            };
            await _dataContext.Project.AddAsync(data);
            foreach (var i in input.Members)
            {
                var member = new MemberProject
                {
                    Id = new Guid(),
                    ProjectId = data.Id,
                    AppUserId = i.EmployeeId,
                    Type = i.Type,
                };
                await _dataContext.MemberProject.AddAsync(member);
            }
            await _dataContext.SaveChangesAsync();
            return CustomResult(data);
        }
        private async Task<IActionResult> Update(CreateOrEditProjectDto input)
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
                                    EmployeeId = m.AppUserId,
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
                        AppUserId = i.EmployeeId,
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
                    _dataContext.MemberProject.Remove(await _dataContext.MemberProject.FirstOrDefaultAsync(m => m.ProjectId == input.Id && m.AppUserId == i.EmployeeId));
                }
                else
                {
                    var memberProject = await _dataContext.MemberProject.AsNoTracking().FirstOrDefaultAsync(e => e.ProjectId == input.Id && e.AppUserId == i.EmployeeId);
                    if (memberProject != null)
                    {
                        memberProject.AppUserId = i.EmployeeId;
                        memberProject.Type = i.Type;
                        _dataContext.MemberProject.Update(memberProject);
                    }
                }
            }
            await _dataContext.SaveChangesAsync();
            return CustomResult(project);
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> DeleteProject(Guid id)
        {
            _dataContext.Issue.RemoveRange(await _dataContext.Issue.Where(e => e.ProjectId == id).ToListAsync());
            await _dataContext.SaveChangesAsync();
            _dataContext.Project.Remove(await _dataContext.Project.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }
    }
}
