using Business.DTOs.EvaluateDto;
using CoreApiResponse;
using Database;
using Entities;
using Entities.Enum.Record;
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
            var role = await (from u in _dataContext.AppUserRole
                                 join r in _dataContext.AppRole on u.RoleId equals r.Id
                                 where u.UserId == userId
                                 select new
                                 {
                                     Role = r.Name,
                                 }).AsNoTracking().ToListAsync();
            var data = await _dataContext.Evaluate.Where(i => i.DateEvaluate.AddDays(-30).Month == month && i.DateEvaluate.Year == year).AsNoTracking().ToListAsync();
            if (role.FirstOrDefault(i => i.Role == "Admin") is not null) return CustomResult(data);
            var list = from d in data
                       join e in _dataContext.Employee on d.UserId equals e.AppUserId
                       where e.Status == RecordStatus.Approved && e.Manager == userId
                       select d;
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
