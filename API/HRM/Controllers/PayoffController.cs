using CoreApiResponse;
using HRM.Data;
using Microsoft.AspNetCore.Mvc;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/payoff")]
    public class PayoffController : BaseController
    {
        private readonly DataContext _dataContext;

        public PayoffController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
    }
}
