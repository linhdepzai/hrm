using HRM.Data;
using HRM.DTOs.AccountDto;
using HRM.DTOs.EmployeeDto;
using HRM.Entities;
using HRM.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
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
        [HttpPut("changePassword")]
        public async Task<ActionResult> ChangePassword(ChangePasswordDto input)
        {
            var user = await _dataContext.Employee.FindAsync(input.Id);
            if (user != null)
            {
                if (!input.Email.Contains(user.Email))
                {

                }
                else if (!input.OldPassword.Contains(user.Password))
                {

                }
                else if (!input.NewPassword.Contains(input.ConfirmPassword))
                {

                }
                else
                {
                    user.Password = input.NewPassword;
                    _dataContext.Employee.Update(user);
                    await _dataContext.SaveChangesAsync();
                }
            };
                    return Ok(user);
        }
        [HttpPut("requestChangeInfor")]
        public async Task<ActionResult<GetAccountDto>> RequestChangeInfor(ChangeInfoDto input)
        {
            var draft = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(i => i.UserCode == input.UserCode && i.Status == Status.Pending);
            if (draft == null)
            {
                var employeeDraft = await _dataContext.Employee.FirstOrDefaultAsync(i => i.UserCode == input.UserCode);
                if (employeeDraft != null)
                {
                    var employee = new Employee
                    {
                        Id = new Guid(),
                        UserCode = input.UserCode,
                        FullName = input.FullName,
                        Sex = input.Sex,
                        Email = input.Email,
                        Password = input.Password,
                        Phone = input.Phone,
                        DoB = input.DoB,
                        Level = employeeDraft.Level,
                        Position = employeeDraft.Position,
                        DepartmentId = employeeDraft.DepartmentId != null ? employeeDraft.DepartmentId : null,
                        StartingDate = input.StartingDate,
                        LeaveDate = null,
                        Bank = input.Bank,
                        BankAccount = input.BankAccount,
                        TaxCode = input.TaxCode,
                        InsuranceStatus = input.InsuranceStatus,
                        Identify = input.Identify,
                        PlaceOfOrigin = input.PlaceOfOrigin,
                        PlaceOfResidence = input.PlaceOfResidence,
                        DateOfIssue = input.DateOfIssue,
                        IssuedBy = input.IssuedBy,
                        Status = Status.Pending,
                    };
                    await _dataContext.Employee.AddAsync(employee);
                    await _dataContext.SaveChangesAsync();
                    return Ok(employee);
                }
                else
                {
                    return BadRequest("Request Failed");
                }
            }
            else
            {
                draft.FullName = input.FullName;
                draft.Sex = input.Sex;
                draft.Email = input.Email;
                draft.Phone = input.Phone;
                draft.DoB = input.DoB;
                draft.Bank = input.Bank;
                draft.BankAccount = input.BankAccount;
                draft.TaxCode = input.TaxCode;
                draft.InsuranceStatus = input.InsuranceStatus;
                draft.Identify = input.Identify;
                draft.PlaceOfOrigin = input.PlaceOfOrigin;
                draft.PlaceOfResidence = input.PlaceOfResidence;
                draft.DateOfIssue = input.DateOfIssue;
                draft.IssuedBy = input.IssuedBy;
                _dataContext.Employee.Update(draft);
                await _dataContext.SaveChangesAsync();
                return Ok(draft);
            }
        }
    }
}
