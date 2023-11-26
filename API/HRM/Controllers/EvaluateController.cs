using Business.DTOs.EvaluateDto;
using CoreApiResponse;
using Database;
using Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace HRM.Controllers
{
    public class EvaluateController : BaseApiController
    {
        private readonly DataContext _dataContext;
        public EvaluateController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("{userId}/Evaluate")]
        public async Task<IActionResult> GetAll(int month, int year, Guid userId)
        {
            var isAdmin = await (from u in _dataContext.AppUserRole
                                 join r in _dataContext.AppRole on u.RoleId equals r.Id
                                 where u.UserId == userId && (r.Name == "Admin")
                                 select new
                                 {
                                     Role = r.Name,
                                 }).AsNoTracking().ToListAsync();
            if (isAdmin.Count > 0) return CustomResult(await _dataContext.Evaluate.Where(i => i.DateEvaluate.AddDays(-30).Month == month && i.DateEvaluate.Year == year).AsNoTracking().ToListAsync());
            var departments = await _dataContext.Department.Where(i => i.Boss == userId).AsNoTracking().ToListAsync();
            var list = new List<Evaluate>();
            foreach (var department in departments)
            {
                List<Evaluate> data = await (from ev in _dataContext.Evaluate
                                             join emp in _dataContext.Employee on ev.UserId equals emp.Id
                                             where emp.DepartmentId == department.Id && ev.DateEvaluate.AddDays(-30).Month == month && ev.DateEvaluate.Year == year
                                             select ev).AsNoTracking().ToListAsync();
                if (list.Any())
                {
                    foreach (var i in data)
                    {
                        list.Add(i);
                    }
                }
                else
                {
                    list = data;
                }
            }
            return CustomResult(list);
        }
        [HttpPut("{userId}/Update")]
        public async Task<IActionResult> Update(UpdateEvaluateDto input, Guid userId)
        {
            var evaluate = await _dataContext.Evaluate.FindAsync(input.Id);
            var employee = await _dataContext.Employee.FirstOrDefaultAsync(i => i.AppUserId == evaluate.UserId && i.IsDeleted == false);
            evaluate.DateEvaluate = DateTime.Now;
            evaluate.OldLevel = employee.Level;
            evaluate.NewLevel = input.NewLevel;
            evaluate.Note = input.Note;
            evaluate.LastModifierUserId = userId;
            _dataContext.Update(evaluate);
            await _dataContext.SaveChangesAsync();
            return CustomResult(evaluate);
        }
    }
}
