using CoreApiResponse;
using HRM.Data;
using HRM.DTOs.EvaluateDto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/evaluate")]
    public class EvaluateController : BaseController
    {
        private readonly DataContext _dataContext;
        public EvaluateController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("Evaluate")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _dataContext.Evaluate.AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateEvaluateDto input)
        {
            var evaluate = await _dataContext.Evaluate.FindAsync(input.Id);
            var employee = await _dataContext.Employee.FirstOrDefaultAsync(i => i.Id == evaluate.EmployeeId);
            evaluate.DateEvaluate = DateTime.Now;
            evaluate.OldLevel = employee.Level;
            evaluate.NewLevel = input.NewLevel;
            evaluate.Note = input.Note;
            evaluate.LastModifierUserId = evaluate.PMId;
            _dataContext.Update(evaluate);
            await _dataContext.SaveChangesAsync();
            return CustomResult(evaluate);
        }
    }
}
