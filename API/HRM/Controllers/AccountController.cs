using HRM.Data;
using HRM.DTOs.AccountDto;
using HRM.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/account")]
    public class AccountController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public AccountController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        [HttpPost("login")]
        public async Task<ActionResult<GetAccountDto>> Login(LoginDto input)
        {
            var checkAccount = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(e => e.Email == input.Email && e.Password == input.Password);
            if (checkAccount == null) return Unauthorized("Your email or password is incorrected!!!");
            var user = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(e => e.Email == input.Email && e.Status == Status.Approved);
            if (user == null) return Unauthorized("Invalid username");
            return new GetAccountDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Sex = user.Sex,
                Email = user.Email,
                Phone = user.Phone,
                DoB = user.DoB,
                Level = user.Level,
                Position = user.Position,
                DepartmentId = user.DepartmentId == null ? null : user.DepartmentId,
                StartingDate = user.StartingDate,
                Bank = user.Bank,
                BankAccount = user.BankAccount,
                TaxCode = user.TaxCode,
                InsuranceStatus = user.InsuranceStatus,
                Identify = user.Identify,
                PlaceOfOrigin = user.PlaceOfOrigin,
                PlaceOfResidence = user.PlaceOfResidence,
                DateOfIssue = user.DateOfIssue,
                IssuedBy = user.IssuedBy,
                UserCode = user.UserCode,
            };
        }
    }
}
