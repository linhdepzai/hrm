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

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/employee")]
    public class EmployeeController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public EmployeeController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getAll")]
        public async Task<ActionResult> GetAll()
        {
            var userList = await _dataContext.Employee.Where(i => i.Status == Status.Approved).AsNoTracking().ToListAsync();
            return Ok(userList);
            /*var dp_params = new DynamicParameters();
            // dp_params.Add("@projectId", projectId, DbType.Guid);
            var userList = await System.Threading.Tasks.Task.FromResult(_dapper.GetAll<GetAllEmployeeDto>("GetAllEmployee", dp_params,
                commandType: System.Data.CommandType.StoredProcedure));
            return Ok(userList);*/
        }
        [HttpGet("getAllRequestChangeInfo")]
        public async Task<ActionResult> GetAllRequestChangeInfo()
        {
            var userList = await _dataContext.Employee.Where(i => i.Status == Status.Pending).AsNoTracking().ToListAsync();
            return Ok(userList);
        }
        [HttpPost("save")]
        public async Task<ActionResult> CreateOrEdit(CreateOrEditEmployeeDto input)
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
        private async Task<ActionResult> Create(CreateOrEditEmployeeDto input)
        {
            var checkId = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(e => e.Identify.ToLower() == input.Identify.ToLower());
            if (checkId != null) return BadRequest("Employee is taken");
            var checkEmail = await _dataContext.Employee.AsNoTracking().FirstOrDefaultAsync(e => e.Email.ToLower() == input.Email.ToLower());
            if (checkEmail != null) return BadRequest("Employee is taken");
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
            await _dataContext.SaveChangesAsync();
            return Ok(employee);
        }
        private async Task<ActionResult> Update(CreateOrEditEmployeeDto input)
        {
            var employee = await _dataContext.Employee.FindAsync(input.Id);
            if (employee.LeaveDate == null) return BadRequest("Employee has retired can't update");
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
            return Ok(employee);
        }
        [HttpPut("updateStatus")]
        public async Task<ActionResult> UpdateStatus(UpdateStatusEmployeeDto input)
        {
            var employeeDraft = await _dataContext.Employee.FindAsync(input.Id);
            if (input.Status == Status.Rejected)
            {
                _dataContext.Employee.Remove(await _dataContext.Employee.FindAsync(input.Id));
                await _dataContext.SaveChangesAsync();
                return Ok("Rejected");
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
                };
                _dataContext.Employee.Update(employee);
                _dataContext.Employee.Remove(await _dataContext.Employee.FindAsync(input.Id));
                await _dataContext.SaveChangesAsync();
                return Ok(employee);
            }
        }
        [HttpDelete("delete")]
        public async Task<ActionResult> Delete(Guid id)
        {
            _dataContext.Department.Remove(await _dataContext.Department.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return Ok("Removed");
        }
        public static string Random(CreateOrEditEmployeeDto input)
        {
            string randomStr = "0";
            switch (input.Position)
            {
                case Position.Dev:
                    randomStr += "1";
                    break;
                case Position.QA:
                    randomStr += "2";
                    break;
                case Position.BA:
                    randomStr += "3";
                    break;
                case Position.PM:
                    randomStr += "4";
                    break;
                case Position.DevOps:
                    randomStr += "5";
                    break;
                case Position.DataEngineer:
                    randomStr += "6";
                    break;
                case Position.ScrumMaster:
                    randomStr += "7";
                    break;
            }
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
