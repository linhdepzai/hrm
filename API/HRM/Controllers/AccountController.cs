using Business.DTOs.AccountDto;
using Business.Interfaces;
using Database;
using Entities;
using Entities.Enum.Record;
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
            var checkAccount = await _dataContext.AppUser.AsNoTracking().FirstOrDefaultAsync(e => e.Email == input.Email && e.Password == input.Password);
            if (checkAccount == null) return CustomResult("Your email or password is incorrected!!!", System.Net.HttpStatusCode.BadRequest);
            var user = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(e => e.AppUserId == checkAccount.Id && e.Status == RecordStatus.Approved);
            if (user == null) return CustomResult("Invalid username", System.Net.HttpStatusCode.BadRequest);
            //var department = await _dataContext.Department.FirstOrDefaultAsync(i => i.Boss == user.Id && i.IsDeleted == false);
            Position position = user.PositionId == null ? null : _dataContext.Position.FirstOrDefault(i => i.Id == user.PositionId);
            Department department = user.DepartmentId == null ? null : _dataContext.Department.FirstOrDefault(i => i.Id == user.DepartmentId);
            var role = await (from ur in _dataContext.AppUserRole
                              join r in _dataContext.AppRole on ur.RoleId equals r.Id
                              where ur.UserId == user.AppUserId
                              select new AccRole
                              {
                                  RoleName = r.Name
                              }
                             ).AsNoTracking().ToListAsync();
            var account = new GetAccountDto
            {
                Id = user.AppUserId,
                Role = role,
                Avatar = checkAccount.AvatarUrl,
                FullName = user.FullName,
                Gender = user.Gender,
                Email = checkAccount.Email,
                Phone = user.Phone,
                DoB = user.DoB,
                Level = user.Level,
                PositionId = position == null ? null : position.Id,
                PositionName = position == null ? null : position.Name,
                PositionColor = position == null ? null : position.Color,
                DepartmentId = department == null ? null : department.Id,
                DepartmentName = department == null ? null : department.Name,
                DepartmentColor = department == null ? null : department.Color,
                StartingDate = user.JoinDate,
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
                Token = _tokenService.CreateToken(checkAccount.Email, user.FullName)
            };
            return CustomResult(account);
        }
        [HttpPut("{userId}/change-password")]
        public async Task<IActionResult> ChangePassword(Guid userId, ChangePasswordDto input)
        {
            var user = await _dataContext.AppUser.FindAsync(userId);
            if (user != null)
            {
                if (String.Compare(input.CurrentPassword, user.Password) != 0)
                {
                    return CustomResult("This old password is not corrected!", System.Net.HttpStatusCode.BadRequest);
                }
                else
                {
                    user.Password = input.NewPassword;
                    _dataContext.AppUser.Update(user);
                    await _dataContext.SaveChangesAsync();
                    return CustomResult(user);
                }
            };
            return CustomResult("Change Password Failed!!!", System.Net.HttpStatusCode.BadRequest);
        }
        [HttpPut("{userId}/request-change-infor")]
        public async Task<IActionResult> RequestChangeInfor(Guid userId, ChangeInfoDto input)
        {
            var draft = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(i => i.AppUserId == userId && i.Status == RecordStatus.Pending);
            if (draft == null)
            {
                var employeeDraft = await _dataContext.Employee.FirstOrDefaultAsync(i => i.AppUserId == userId && i.Status == RecordStatus.Approved);
                if (employeeDraft != null)
                {
                    var employee = new Employee
                    {
                        Id = new Guid(),
                        AppUserId = employeeDraft.AppUserId,
                        UserCode = employeeDraft.UserCode,
                        FullName = employeeDraft.FullName,
                        Gender = employeeDraft.Gender,
                        Phone = input.Phone,
                        Identify = employeeDraft.Identify,
                        DoB = employeeDraft.DoB,
                        Level = employeeDraft.Level,
                        PositionId = employeeDraft.PositionId,
                        DepartmentId = employeeDraft.DepartmentId != null ? employeeDraft.DepartmentId : null,
                        Manager = employeeDraft.Manager,
                        JoinDate = employeeDraft.JoinDate,
                        IsActive = false,
                        Bank = input.Bank,
                        BankAccount = input.BankAccount,
                        TaxCode = input.TaxCode,
                        InsuranceStatus = input.InsuranceStatus,
                        PlaceOfOrigin = input.PlaceOfOrigin,
                        PlaceOfResidence = input.PlaceOfResidence,
                        DateOfIssue = input.DateOfIssue,
                        IssuedBy = input.IssuedBy,
                        Status = RecordStatus.Pending,
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
                draft.Phone = input.Phone;
                draft.Bank = input.Bank;
                draft.BankAccount = input.BankAccount;
                draft.TaxCode = input.TaxCode;
                draft.InsuranceStatus = input.InsuranceStatus;
                draft.PlaceOfOrigin = input.PlaceOfOrigin;
                draft.PlaceOfResidence = input.PlaceOfResidence;
                draft.DateOfIssue = input.DateOfIssue;
                draft.IssuedBy = input.IssuedBy;
                _dataContext.Employee.Update(draft);
                await _dataContext.SaveChangesAsync();
                return CustomResult(draft);
            }
        }
        [HttpGet("{userId}/get-all-request-change-timeWorking")]
        public async Task<IActionResult> getAllRequestChangeTimeWorkingForUser(Guid userId)
        {
            var list = await _dataContext.TimeWorking.Where(i => i.UserId == userId).AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpPost("{userId}/change-avatar")]
        public async Task<IActionResult> ChangeAvatar(Guid userId, IFormFile file)
        {
            var employee = await _dataContext.AppUser.FindAsync(userId);
            if (employee != null)
            {
                var result = await _photoService.AddPhotoAsync(file);

                if (result.Error != null) return CustomResult(result.Error.Message, System.Net.HttpStatusCode.BadRequest);

                employee.AvatarUrl = result.SecureUrl.AbsoluteUri;
                employee.PublicId = result.PublicId;
                _dataContext.AppUser.Update(employee);
                await _dataContext.SaveChangesAsync();
            }
            return CustomResult(employee);
        }
    }
}
