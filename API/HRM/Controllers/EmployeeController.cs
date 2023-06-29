using HRM.Data;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using HRM.DTOs.EmployeeDto;
using HRM.Entities;
using Microsoft.EntityFrameworkCore;
using HRM.Enum;
using HRM.DTOs.AccountDto;
using System.Linq;
using CoreApiResponse;
using System.Collections.Generic;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/employee")]
    public class EmployeeController : BaseController
    {
        private readonly DataContext _dataContext;

        public EmployeeController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll(Guid? id)
        {
            if (id != null)
            {
                var user = await _dataContext.Employee.FindAsync(id);
                var isAdmin = await _dataContext.Position.FirstOrDefaultAsync(i => i.Name == "Admin");
                if (user.Position == isAdmin.Id) return CustomResult(await _dataContext.Employee.Where(i => i.Status == Status.Approved && i.IsDeleted == false).AsNoTracking().ToListAsync());
                var departments = await _dataContext.Department.Where(i => i.Boss == id).AsNoTracking().ToListAsync();
                var list = new List<Employee>();
                foreach (var department in departments)
                {
                    var data = await _dataContext.Employee.Where(i => i.Status == Status.Approved && i.IsDeleted == false && i.DepartmentId == department.Id).AsNoTracking().ToListAsync();
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
                var userList = await _dataContext.Employee.Where(i => i.Status == Status.Approved && i.IsDeleted == false).AsNoTracking().ToListAsync();
                return CustomResult(userList);
            }
        }
        [HttpGet("getAllRequestChangeInfo/{id}")]
        public async Task<IActionResult> GetAllRequestChangeInfo(Guid id)
        {
            var user = await _dataContext.Employee.FindAsync(id);
            var isAdmin = await _dataContext.Position.FirstOrDefaultAsync(i => i.Name == "Admin");
            if (user.Position == isAdmin.Id) return CustomResult(await _dataContext.Employee.Where(i => i.Status == Status.Pending && i.IsDeleted == false).AsNoTracking().ToListAsync());
            var departments = await _dataContext.Department.Where(i => i.Boss == id).AsNoTracking().ToListAsync();
            var list = new List<Employee>();
            foreach (var department in departments)
            {
                var data = await _dataContext.Employee.Where(i => i.Status == Status.Pending && i.IsDeleted == false && i.DepartmentId == department.Id).AsNoTracking().ToListAsync();
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
        [HttpPost("save")]
        public async Task<IActionResult> CreateOrEdit(CreateOrEditEmployeeDto input)
        {
            if (input.Id == null)
            {
                return await Create(input);
            }
            else
            {
                return await Update(input);
            }
        }
        private async Task<IActionResult> Create(CreateOrEditEmployeeDto input)
        {
            var checkId = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(e => e.Identify.ToLower() == input.Identify.ToLower());
            if (checkId != null) return CustomResult("Employee is taken", System.Net.HttpStatusCode.BadRequest);
            var checkEmail = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(e => e.Email.ToLower() == input.Email.ToLower());
            if (checkEmail != null) return CustomResult("Employee is taken", System.Net.HttpStatusCode.BadRequest);
            var employee = new Employee
            {
                Id = new Guid(),
                UserCode = Random(input),
                FullName = input.FullName,
                Sex = input.Sex,
                Email = input.Email,
                Password = input.Password,
                Phone = input.Phone,
                DoB = input.DoB,
                Level = input.Level,
                Position = input.Position,
                DepartmentId = input.DepartmentId != null ? input.DepartmentId : null,
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
                Status = Status.Approved,
            };
            await _dataContext.Employee.AddAsync(employee);
            var today = DateTime.Today;
            var timeWorking = new TimeWorking
            {
                Id = new Guid(),
                EmployeeId = employee.Id,
                MorningStartTime = today.AddHours(8.5),
                MorningEndTime = today.AddHours(12),
                AfternoonStartTime = today.AddHours(13),
                AfternoonEndTime = today.AddHours(17.5),
                ApplyDate = today,
                RequestDate = today,
                Status = Status.Approved,
            };
            await _dataContext.TimeWorking.AddAsync(timeWorking);
            var salary = await _dataContext.Salary.FirstOrDefaultAsync(i => i.Level == input.Level && i.Position == input.Position);
            var employeeSalary = new SalaryForEmployee
            {
                Id = new Guid(),
                EmployeeId = employee.Id,
                Salary = salary.Id,
            };
            await _dataContext.SalaryForEmployee.AddAsync(employeeSalary);
            await _dataContext.SaveChangesAsync();
            return CustomResult(employee);
        }
        private async Task<IActionResult> Update(CreateOrEditEmployeeDto input)
        {
            var employee = await _dataContext.Employee.FindAsync(input.Id);
            if (employee.LeaveDate != null) return CustomResult("Employee has retired can't update", System.Net.HttpStatusCode.BadRequest);
            if (employee != null)
            {
                employee.FullName = input.FullName;
                employee.Sex = input.Sex;
                employee.Email = input.Email;
                employee.Phone = input.Phone;
                employee.DoB = input.DoB;
                employee.Level = input.Level;
                employee.Position = input.Position;
                employee.DepartmentId = input.DepartmentId != null ? input.DepartmentId : null;
                employee.StartingDate = input.StartingDate;
                employee.LeaveDate = null;
                employee.Bank = input.Bank;
                employee.BankAccount = input.BankAccount;
                employee.TaxCode = input.TaxCode;
                employee.InsuranceStatus = input.InsuranceStatus;
                employee.Identify = input.Identify;
                employee.PlaceOfOrigin = input.PlaceOfOrigin;
                employee.PlaceOfResidence = input.PlaceOfResidence;
                employee.DateOfIssue = input.DateOfIssue;
                employee.IssuedBy = input.IssuedBy;
                employee.Status = Status.Approved;
            };
            _dataContext.Employee.Update(employee);
            await _dataContext.SaveChangesAsync();
            return CustomResult(employee);
        }
        [HttpPut("updateStatus")]
        public async Task<IActionResult> UpdateStatus(UpdateStatusEmployeeDto input)
        {
            var employeeDraft = await _dataContext.Employee.FindAsync(input.Id);
            if (input.Status == Status.Rejected)
            {
                employeeDraft.DeleteUserId = input.PmId;
                _dataContext.Employee.Remove(await _dataContext.Employee.FindAsync(input.Id));
                await _dataContext.SaveChangesAsync();
                return CustomResult("Rejected");
            }
            else
            {
                var employee = await _dataContext.Employee.FirstOrDefaultAsync(i => i.UserCode == employeeDraft.UserCode && i.Status == Status.Approved);
                if (employee != null)
                {
                    employee.FullName = employeeDraft.FullName;
                    employee.Sex = employeeDraft.Sex;
                    employee.Email = employeeDraft.Email;
                    employee.Phone = employeeDraft.Phone;
                    employee.DoB = employeeDraft.DoB;
                    employee.StartingDate = employeeDraft.StartingDate;
                    employee.Bank = employeeDraft.Bank;
                    employee.BankAccount = employeeDraft.BankAccount;
                    employee.TaxCode = employeeDraft.TaxCode;
                    employee.InsuranceStatus = employeeDraft.InsuranceStatus;
                    employee.Identify = employeeDraft.Identify;
                    employee.PlaceOfOrigin = employeeDraft.PlaceOfOrigin;
                    employee.PlaceOfResidence = employeeDraft.PlaceOfResidence;
                    employee.DateOfIssue = employeeDraft.DateOfIssue;
                    employee.IssuedBy = employeeDraft.IssuedBy;
                    employee.Status = Status.Approved;
                    employee.LastModifierUserId = input.PmId;
                };
                _dataContext.Employee.Update(employee);
                employeeDraft.DeleteUserId = input.PmId;
                _dataContext.Employee.Remove(await _dataContext.Employee.FindAsync(input.Id));
                await _dataContext.SaveChangesAsync();
                return CustomResult(employee);
            }
        }
        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> Delete(Guid id, Guid employeeId)
        {
            var employee = await _dataContext.Employee.FindAsync(employeeId);
            employee.LeaveDate = DateTime.Now;
            employee.DeleteUserId = id;
            _dataContext.Update(employee);
            _dataContext.Employee.Remove(employee);
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }
        public static string Random(CreateOrEditEmployeeDto input)
        {
            string randomStr = "0" + input.Position;
            if (input.Sex == true) randomStr += "01"; else randomStr += "02";
            randomStr += DateTime.Now.ToString("yy");
            try
            {
                int[] myIntArray = new int[4];
                int x;
                //that is to create the random # and add it to uour string
                Random autoRand = new Random();
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
