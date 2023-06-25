using CoreApiResponse;
using HRM.Data;
using HRM.DTOs.DepartmentDto;
using HRM.Entities;
using Microsoft.AspNetCore.Mvc;
using System.Net;
using System.Threading.Tasks;
using System;
using Microsoft.EntityFrameworkCore;
using HRM.DTOs.PositionDto;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/position")]
    public class PositionController : BaseController
    {
        private readonly DataContext _dataContext;

        public PositionController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            var list = await _dataContext.Position.AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpPost("save")]
        public async Task<IActionResult> CreateOrEdit(CreateOrEditPostionDto input)
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
        private async Task<IActionResult> Create(CreateOrEditPostionDto input)
        {
            var newPosition = await _dataContext.Position.AsNoTracking().FirstOrDefaultAsync(e => e.Name.ToLower() == input.Name.ToLower());
            if (newPosition != null) return CustomResult("PositionName is taken", HttpStatusCode.NotFound);
            var position = new Position
            {
                Id = new int(),
                Name = input.Name,
                Color = input.Color,
            };
            await _dataContext.Position.AddAsync(position);
            await _dataContext.SaveChangesAsync();
            return CustomResult(position);
        }
        private async Task<IActionResult> Update(CreateOrEditPostionDto input)
        {
            var position = await _dataContext.Department.FindAsync(input.Id);
            if (position != null)
            {
                position.Name = input.Name;
                position.Color = input.Color;
            };
            _dataContext.Department.Update(position);
            await _dataContext.SaveChangesAsync();
            return CustomResult(position);
        }
        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(Guid id)
        {
            _dataContext.Position.Remove(await _dataContext.Position.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }
    }
}
