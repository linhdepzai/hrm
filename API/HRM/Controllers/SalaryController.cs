using HRM.Data;
using Microsoft.AspNetCore.Mvc;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/salary")]
    public class SalaryController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public SalaryController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
    }
}
