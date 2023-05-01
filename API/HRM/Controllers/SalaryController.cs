using CoreApiResponse;
using HRM.Data;
using HRM.DTOs.SalaryDto;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/salary")]
    public class SalaryController : BaseController
    {
        private readonly DataContext _dataContext;

        public SalaryController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var userList = await _dataContext.Salary.AsNoTracking().ToListAsync();
            return CustomResult(userList);
        }
        [HttpPut("Update")]
        public async Task<IActionResult> Update(UpdateSalaryDto input)
        {
            var salary = await _dataContext.Salary.FindAsync(input.Id);
            salary.Money = input.Money;
            salary.Welfare = input.Welfare;
            salary.LastModifierUserId = input.Accoutant;
            _dataContext.Update(salary);
            await _dataContext.SaveChangesAsync();
            return CustomResult(salary);
        }

    }
}
