using HRM.Data;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System;
using HRM.DTOs.EmployeeDto;
using HRM.Entities;
using Microsoft.EntityFrameworkCore;
using HRM.Enum;

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
            var list = await _dataContext.Employee.AsNoTracking().ToListAsync();
            return Ok(list);
        }
        [HttpPost("save")]
        public async Task<ActionResult> CreateOrEdit(CreateOrEditEmployeeDto input)
        {
            if (input.Id == null)
            {
                return await Update(input);
            }
            else
            {
                return await Create(input);
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
                FullName = input.FullName,
                Sex = input.Sex,
                Email = input.Email,
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
                employee.Status = Status.New;
            };
            _dataContext.Employee.Update(employee);
            await _dataContext.SaveChangesAsync();
            return Ok(employee);
        }
        [HttpPut("updateStatus")]
        public async Task<ActionResult> UpdateStatus(UpdateStatusEmployeeDto input)
        {
            var employee = await _dataContext.Employee.FindAsync(input.Id);
            if (employee != null)
            {
                if (employee.Position != Position.PM)
                {
                    employee.Status = Status.Pending;
                }
                else
                {
                    employee.Status = input.Status;
                }
            };
            _dataContext.Employee.Update(employee);
            await _dataContext.SaveChangesAsync();
            return Ok(employee);
        }
        [HttpDelete("delete")]
        public async Task<ActionResult> Delete(Guid id)
        {
            _dataContext.Department.Remove(await _dataContext.Department.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return Ok("Removed");
        }
    }
}
