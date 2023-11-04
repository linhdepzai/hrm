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
        private readonly ISession _session;
        public EvaluateController(DataContext dataContext, ISession session)
        {
            _dataContext = dataContext;
            _session = session;
        }
        [HttpGet("Evaluate")]
        public async Task<IActionResult> GetAll(int month, int year)
        {

            var user = await _dataContext.Employee.FindAsync(new Guid(_session.GetString("UserId")));
            var isAdmin = await _dataContext.Position.FirstOrDefaultAsync(i => i.Name == "Admin");
            if (user.PositionId == isAdmin.Id) return CustomResult(await _dataContext.Evaluate.Where(i => i.DateEvaluate.AddDays(-30).Month == month && i.DateEvaluate.Year == year).AsNoTracking().ToListAsync());
            var departments = await _dataContext.Department.Where(i => i.Boss == new Guid(_session.GetString("UserId"))).AsNoTracking().ToListAsync();
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
        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateEvaluateDto input)
        {
            var evaluate = await _dataContext.Evaluate.FindAsync(input.Id);
            var employee = await _dataContext.Employee.FirstOrDefaultAsync(i => i.Id == evaluate.UserId);
            evaluate.DateEvaluate = DateTime.Now;
            evaluate.OldLevel = employee.Level;
            evaluate.NewLevel = input.NewLevel;
            evaluate.Note = input.Note;
            evaluate.LastModifierUserId = new Guid(_session.GetString("UserId"));
            _dataContext.Update(evaluate);
            await _dataContext.SaveChangesAsync();
            return CustomResult(evaluate);
        }
    }
}
