using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Database;
using Entities;
using Business.DTOs.EmployeeDto;
using Entities.Enum.Record;

namespace HRM.Controllers
{
    public class EmployeeController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public EmployeeController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("{userId}/get-all/{status}")]
        public async Task<IActionResult> GetAll(Guid userId, string status)
        {
            RecordStatus stt = status == "Approved" ? RecordStatus.Approved: RecordStatus.Pending;
            var user = await _dataContext.AppUser.FindAsync(userId);
            var isAdmin = await (from u in _dataContext.AppUserRole
                                 join r in _dataContext.AppRole on u.RoleId equals r.Id
                                 where u.UserId == userId && r.Name == "Admin"
                                 select new
                                 {
                                     Role = r.Name,
                                 }).AsNoTracking().ToListAsync();
            var departments = await _dataContext.Department.Where(i => i.Boss == userId).AsNoTracking().ToListAsync();
            var data = await (from e in _dataContext.Employee
                              join u in _dataContext.AppUser on e.AppUserId equals u.Id
                              where e.Status == stt && e.IsDeleted == false
                              select new GetAllEmployeeForViewDto
                              {
                                  Id = e.Id,
                                  UserCode = e.UserCode,
                                  AppUserId = e.AppUserId,
                                  Roles = (from r in _dataContext.AppRole
                                          join ur in _dataContext.AppUserRole on r.Id equals ur.RoleId
                                          where ur.UserId == u.Id
                                          select new AppRole { 
                                            Id = r.Id,
                                            Name = r.Name,
                                          }).AsNoTracking().ToList(),
                                  FullName = e.FullName,
                                  Gender = e.Gender,
                                  Email = u.Email,
                                  Password = u.Password,
                                  Phone = e.Phone,
                                  DoB = e.DoB,
                                  Level = e.Level,
                                  PositionId = e.PositionId,
                                  DepartmentId = e.DepartmentId,
                                  JoinDate = e.JoinDate,
                                  Manager = e.Manager,
                                  Bank = e.Bank,
                                  BankAccount = e.BankAccount,
                                  TaxCode = e.TaxCode,
                                  InsuranceStatus = e.InsuranceStatus,
                                  Identify = e.Identify,
                                  PlaceOfOrigin = e.PlaceOfOrigin,
                                  PlaceOfResidence = e.PlaceOfResidence,
                                  DateOfIssue = e.DateOfIssue,
                                  IssuedBy = e.IssuedBy
                              }).AsNoTracking().ToListAsync();
            if (isAdmin.Count > 0) return CustomResult(data);
            if (departments.Count > 0)
            {
                var list = new List<GetAllEmployeeForViewDto>();
                foreach (var department in departments)
                {
                    data = data.Where(e => e.DepartmentId == department.Id).ToList();
                    if (list.Any())
                    {
                        foreach (var i in data)
                        {
                            list.Add(i);
                        }
                    }
                    else
                    {
                        list = data;
                    }
                }
                return CustomResult(list);
            }
            else
            {
                return CustomResult(data);
            }
        }
        [HttpPost("{userId}/save")]
        public async Task<IActionResult> CreateOrEdit(Guid userId, CreateOrEditEmployeeDto input)
        {
            if (input.Id == null)
            {
                return await Create(userId, input);
            }
            else
            {
                return await Update(userId, input);
            }
        }
        private async Task<IActionResult> Create(Guid userId, CreateOrEditEmployeeDto input)
        {
            var checkId = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(e => e.Identify.ToLower() == input.Identify.ToLower());
            if (checkId != null) return CustomResult("Employee is taken", System.Net.HttpStatusCode.BadRequest);
            var checkEmail = await _dataContext.AppUser.AsNoTracking().FirstOrDefaultAsync(e => e.Email.ToLower() == input.Email.ToLower());
            if (checkEmail != null) return CustomResult("Employee is taken", System.Net.HttpStatusCode.BadRequest);
            var account = new AppUser
            {
                Id = new Guid(),
                Email = input.Email,
                Password = input.Password,
            };
            await _dataContext.AppUser.AddAsync(account);
            foreach(var r in input.Roles)
            {
                var role = new AppUserRole
                {
                    Id = new Guid(),
                    UserId = account.Id,
                    RoleId = r,
                };
                await _dataContext.AppUserRole.AddAsync(role);
            }
            var employee = new Employee
            {
                Id = new Guid(),
                AppUserId = account.Id,
                UserCode = Random(input),
                FullName = input.FullName,
                Gender = input.Gender,
                Phone = input.Phone,
                DoB = input.DoB,
                Level = input.Level,
                PositionId = input.PositionId,
                DepartmentId = input.DepartmentId != null ? input.DepartmentId : null,
                JoinDate = DateTime.Now,
                Manager = input.Manager,
                IsActive = true,
                Bank = input.Bank,
                BankAccount = input.BankAccount,
                TaxCode = input.TaxCode,
                InsuranceStatus = input.InsuranceStatus,
                Identify = input.Identify,
                PlaceOfOrigin = input.PlaceOfOrigin,
                PlaceOfResidence = input.PlaceOfResidence,
                DateOfIssue = input.DateOfIssue,
                IssuedBy = input.IssuedBy,
                Status = RecordStatus.Approved,
                CreatorUserId = userId,
                IsDeleted = false,
            };
            await _dataContext.Employee.AddAsync(employee);
            var today = DateTime.Today;
            var timeWorking = new TimeWorking
            {
                Id = new Guid(),
                UserId = account.Id,
                MorningStartTime = today.AddHours(8.5),
                MorningEndTime = today.AddHours(12),
                AfternoonStartTime = today.AddHours(13),
                AfternoonEndTime = today.AddHours(17.5),
                ApplyDate = today,
                RequestDate = today,
                Status = RecordStatus.Approved,
                CreatorUserId = userId,
                IsDeleted = false,
            };
            await _dataContext.TimeWorking.AddAsync(timeWorking);
            var salary = await _dataContext.Salary.FirstOrDefaultAsync(i => i.Level == input.Level && i.PositionId == input.PositionId);
            var employeeSalary = new EmployeeSalary
            {
                Id = new Guid(),
                AppUserId = account.Id,
                SalaryId = salary.Id,
                CreatorUserId = userId,
                IsDeleted = false,
            };
            await _dataContext.EmployeeSalary.AddAsync(employeeSalary);
            await _dataContext.SaveChangesAsync();
            return CustomResult(employee);
        }
        private async Task<IActionResult> Update(Guid userId, CreateOrEditEmployeeDto input)
        {
            var employee = await _dataContext.Employee.FindAsync(input.Id);
            if (!employee.IsActive) return CustomResult("Employee has retired can't update", System.Net.HttpStatusCode.BadRequest);
            var account = await _dataContext.AppUser.FindAsync(employee.AppUserId);
            if (account != null)
            {
                account.Email = input.Email;
                account.Password = input.Password;
                _dataContext.AppUser.Update(account);
            };
            _dataContext.AppUserRole.RemoveRange(await _dataContext.AppUserRole.Where(i => i.UserId == account.Id).AsNoTracking().ToListAsync());
            foreach (var r in input.Roles)
            {
                var role = new AppUserRole
                {
                    Id = new Guid(),
                    UserId = account.Id,
                    RoleId = r,
                };
                await _dataContext.AppUserRole.AddAsync(role);
            }
            if (employee != null)
            {
                employee.FullName = input.FullName;
                employee.Gender = input.Gender;
                employee.Phone = input.Phone;
                employee.DoB = input.DoB;
                employee.Level = input.Level;
                employee.PositionId = input.PositionId;
                employee.DepartmentId = input.DepartmentId != null ? input.DepartmentId : null;
                employee.Manager = input.Manager;
                employee.IsActive = true;
                employee.Bank = input.Bank;
                employee.BankAccount = input.BankAccount;
                employee.TaxCode = input.TaxCode;
                employee.InsuranceStatus = input.InsuranceStatus;
                employee.Identify = input.Identify;
                employee.PlaceOfOrigin = input.PlaceOfOrigin;
                employee.PlaceOfResidence = input.PlaceOfResidence;
                employee.DateOfIssue = input.DateOfIssue;
                employee.IssuedBy = input.IssuedBy;
                employee.Status = RecordStatus.Approved;
                employee.LastModifierUserId = userId;
                _dataContext.Employee.Update(employee);
            };
            await _dataContext.SaveChangesAsync();
            return CustomResult(employee);
        }
        [HttpPut("{userId}/update-status")]
        public async Task<IActionResult> UpdateStatus(Guid userId, UpdateStatusEmployeeDto input)
        {
            var employeeDraft = await _dataContext.Employee.FindAsync(input.Id);
            if (input.Status == RecordStatus.Rejected)
            {
                employeeDraft.DeleteUserId = userId;
                _dataContext.Employee.Remove(await _dataContext.Employee.FindAsync(input.Id));
                await _dataContext.SaveChangesAsync();
                return CustomResult("Rejected");
            }
            else
            {
                var employee = await _dataContext.Employee.FirstOrDefaultAsync(i => i.UserCode == employeeDraft.UserCode && i.Status == RecordStatus.Approved);
                if (employee != null)
                {
                    employee.FullName = employeeDraft.FullName;
                    employee.Gender = employeeDraft.Gender;
                    employee.Phone = employeeDraft.Phone;
                    employee.DoB = employeeDraft.DoB;
                    employee.JoinDate = employeeDraft.JoinDate;
                    employee.Bank = employeeDraft.Bank;
                    employee.Manager = employeeDraft.Manager;
                    employee.BankAccount = employeeDraft.BankAccount;
                    employee.TaxCode = employeeDraft.TaxCode;
                    employee.InsuranceStatus = employeeDraft.InsuranceStatus;
                    employee.Identify = employeeDraft.Identify;
                    employee.PlaceOfOrigin = employeeDraft.PlaceOfOrigin;
                    employee.PlaceOfResidence = employeeDraft.PlaceOfResidence;
                    employee.DateOfIssue = employeeDraft.DateOfIssue;
                    employee.IssuedBy = employeeDraft.IssuedBy;
                    employee.Status = RecordStatus.Approved;
                    employee.LastModifierUserId = userId;
                };
                _dataContext.Employee.Update(employee);
                employeeDraft.DeleteUserId = userId;
                _dataContext.Employee.Remove(await _dataContext.Employee.FindAsync(input.Id));
                await _dataContext.SaveChangesAsync();
                return CustomResult(employee);
            }
        }
        [HttpDelete("{userId}/delete")]
        public async Task<IActionResult> Delete(Guid employeeId, Guid userId)
        {
            var employee = await _dataContext.Employee.FindAsync(employeeId);
            employee.IsActive = true;
            employee.DeleteUserId = userId;
            _dataContext.Update(employee);
            _dataContext.Employee.Remove(employee);
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }
        public static string Random(CreateOrEditEmployeeDto input)
        {
            Random autoRand = new Random();
            string randomStr = "0" + System.Convert.ToInt32(autoRand.Next(0, 9));
            randomStr += input.Gender ? "01" : "02"; ;
            randomStr += DateTime.Now.ToString("yy");
            try
            {
                int[] myIntArray = new int[8];
                int x;
                //that is to create the random # and add it to uour string
                for (x = 0; x < 4; x++)
                {
                    myIntArray[x] = System.Convert.ToInt32(autoRand.Next(0, 9));
                    randomStr += (myIntArray[x].ToString());
                }
            }
            catch (Exception ex)
            {
                randomStr = "error";
            }
            return randomStr;
        }
    }
}
