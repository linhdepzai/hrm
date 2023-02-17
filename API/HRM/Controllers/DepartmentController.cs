using HRM.Data;
using HRM.DTOs.DepartmentDto;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using HRM.Entities;
using System;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/department")]
    public class DepartmentController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public DepartmentController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getAll")]
        public async Task<ActionResult> GetAll()
        {
            var list = await _dataContext.Department.AsNoTracking().ToListAsync();
            return Ok(list);
        }
        [HttpPost("save")]
        public async Task<ActionResult> CreateOrEdit(CreateOrEditDepartmentDto input)
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
        private async Task<ActionResult> Create(CreateOrEditDepartmentDto input)
        {
            var newDepartment = await _dataContext.Department.AsNoTracking().FirstOrDefaultAsync(e => e.Name.ToLower() == input.Name.ToLower());
            if (newDepartment != null) return BadRequest("DepartmentName is taken");
            var department = new Department
            {
                Id = new Guid(),
                Name = input.Name,
                Color = input.Color,
            };
            await _dataContext.Department.AddAsync(department);
            await _dataContext.SaveChangesAsync();
            return Ok(department);
        }
        private async Task<ActionResult> Update(CreateOrEditDepartmentDto input)
        {
            var department = await _dataContext.Department.FindAsync(input.Id);
            if(department != null)
            {
                department.Name = input.Name;
                department.Color = input.Color;
            };
            _dataContext.Department.Update(department);
            await _dataContext.SaveChangesAsync();
            return Ok(department);
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
