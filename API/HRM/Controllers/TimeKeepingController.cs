using HRM.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/timekeeping")]
    public class TimeKeepingController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public TimeKeepingController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
    }
}
