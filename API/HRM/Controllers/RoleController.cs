using Business.DTOs.AccountDto;
using Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRM.Controllers
{
    public class RoleController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public RoleController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("get-all")]
        public async Task<IActionResult> GetAll()
        {
            var result = await _dataContext.AppRole.AsNoTracking().ToListAsync();
            return CustomResult(result);
        }
    }
}
