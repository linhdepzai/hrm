using Business.DTOs.AccountDto;
using Business.Interfaces;
using Database;
using Entities;
using Entities.Enum;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRM.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly ITokenService _tokenService;
        private readonly IPhotoService _photoService;

        public AccountController(
            DataContext dataContext,
            ITokenService tokenService,
            IPhotoService photoService
            )
        {
            _dataContext = dataContext;
            _tokenService = tokenService;
            _photoService = photoService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginDto input)
        {
            var checkAccount = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(e => e.Email == input.Email && e.Password == input.Password);
            if (checkAccount == null) return CustomResult("Your email or password is incorrected!!!", System.Net.HttpStatusCode.BadRequest);
            var user = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(e => e.Email == input.Email && e.Status == Status.Approved);
            if (user == null) return CustomResult("Invalid username", System.Net.HttpStatusCode.BadRequest);
            var department = await _dataContext.Department.FirstOrDefaultAsync(i => i.Boss == user.Id && i.IsDeleted == false);
            var account = new GetAccountDto
            {
                Id = user.Id,
                Avatar = user.Avatar,
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
                Token = _tokenService.CreateToken(user),
                IsLeader = department == null ? false : true,
            };
            return CustomResult(account);
        }
        [HttpPut("changePassword")]
        public async Task<IActionResult> ChangePassword(ChangePasswordDto input)
        {
            var user = await _dataContext.Employee.FindAsync(input.Id);
            if (user != null)
            {
                if (String.Compare(input.Email, user.Email) == 1)
                {
                    return CustomResult("This email is not corrected!", System.Net.HttpStatusCode.BadRequest);
                }
                else if (String.Compare(input.OldPassword, user.Password) == 1)
                {
                    return CustomResult("This old password is not corrected!", System.Net.HttpStatusCode.BadRequest);
                }
                else if (String.Compare(input.NewPassword, input.ConfirmPassword) == 1)
                {
                    return CustomResult("This password confirm is not corrected!", System.Net.HttpStatusCode.BadRequest);
                }
                else
                {
                    user.Password = input.NewPassword;
                    _dataContext.Employee.Update(user);
                    await _dataContext.SaveChangesAsync();
                    return CustomResult(user);
                }
            };
            return CustomResult(null);
        }
        [HttpPut("requestChangeInfor")]
        public async Task<IActionResult> RequestChangeInfor(ChangeInfoDto input)
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
                    return CustomResult(employee);
                }
                else
                {
                    return CustomResult("Request Failed", System.Net.HttpStatusCode.BadRequest);
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
                return CustomResult(draft);
            }
        }
        [HttpGet("getAllRequestChangeTimeWorkingForUser")]
        public async Task<IActionResult> getAllRequestChangeTimeWorkingForUser(Guid id)
        {
            var list = await _dataContext.TimeWorking.Where(i => i.EmployeeId == id).AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpPost("changeAvatar/{id}")]
        public async Task<IActionResult> ChangeAvatar(IFormFile file, Guid id)
        {
            var employee = await _dataContext.Employee.FindAsync(id);
            if (employee != null)
            {
                var result = await _photoService.AddPhotoAsync(file);

                if (result.Error != null) return CustomResult(result.Error.Message, System.Net.HttpStatusCode.BadRequest);

                employee.Avatar = result.SecureUrl.AbsoluteUri;
                employee.PublicId = result.PublicId;
                employee.LastModifierUserId = id;
                _dataContext.Employee.Update(employee);
                await _dataContext.SaveChangesAsync();
            }
            return CustomResult(employee);
        }
    }
}
