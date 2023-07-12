using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Net;
using System.Linq;
using Database;
using Business.DTOs.DepartmentDto;
using Entities;
using CoreApiResponse;
using Business.Repository;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Business.Interfaces.IDepartmentService;

namespace HRM.Controllers
{
    public class DepartmentController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly IDepartmentAppService _departmentService;

        public DepartmentController(DataContext dataContext, IDepartmentAppService departmentService)
        {
            _dataContext = dataContext;
            _departmentService = departmentService;
        }
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _departmentService.GetAll();
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
                Boss = input.Boss,
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
                department.Boss = input.Boss;
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
