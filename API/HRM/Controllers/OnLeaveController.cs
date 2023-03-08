using HRM.Data;
using HRM.DTOs.EmployeeDto;
using HRM.Entities;
using HRM.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using HRM.DTOs.OnLeaveDto;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/onleave")]
    public class OnLeaveController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public OnLeaveController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpPost("requestLeave")]
        public async Task<ActionResult> Create(CreateOrEditOnLeaveDto input)
        {
            foreach (var i in input.OnLeave)
            {
                var onLeave = new OnLeave
                {
                    Id = new Guid(),
                    EmployeeId = input.EmployeeId,
                    DateLeave = i.DateLeave,
                    Option = i.Option,
                    Reason = i.Reason,
                    Status = Status.New,
                };
                await _dataContext.OnLeave.AddAsync(onLeave);
            };
            await _dataContext.SaveChangesAsync();
            return Ok(input);
        }
    }
}
