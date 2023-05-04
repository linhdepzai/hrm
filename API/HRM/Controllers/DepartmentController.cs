using HRM.Data;
using HRM.DTOs.DepartmentDto;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using HRM.Entities;
using System;
using CoreApiResponse;
using System.Net;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/department")]
    public class DepartmentController : BaseController
    {
        private readonly DataContext _dataContext;

        public DepartmentController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _dataContext.Department.AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpPost("save")]
        public async Task<IActionResult> CreateOrEdit(CreateOrEditDepartmentDto input)
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
        private async Task<IActionResult> Create(CreateOrEditDepartmentDto input)
        {
            var newDepartment = await _dataContext.Department.AsNoTracking().FirstOrDefaultAsync(e => e.Name.ToLower() == input.Name.ToLower());
            if (newDepartment != null) return CustomResult("DepartmentName is taken", HttpStatusCode.NotFound);
            var department = new Department
            {
                Id = new Guid(),
                Name = input.Name,
                Color = input.Color,
            };
            await _dataContext.Department.AddAsync(department);
            await _dataContext.SaveChangesAsync();
            return CustomResult(department);
        }
        private async Task<IActionResult> Update(CreateOrEditDepartmentDto input)
        {
            var department = await _dataContext.Department.FindAsync(input.Id);
            if(department != null)
            {
                department.Name = input.Name;
                department.Color = input.Color;
            };
            _dataContext.Department.Update(department);
            await _dataContext.SaveChangesAsync();
            return CustomResult(department);
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(Guid id)
        {
            _dataContext.Department.Remove(await _dataContext.Department.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }
    }
}
