using Business.DTOs.DepartmentDto;
using Business.DTOs.MessageDto;
using Business.Interfaces.IDepartmentService;
using Database;
using Entities;
using Entities.Enum;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Services.DepartmentService
{
    public class DepartmentAppService : IDepartmentAppService
    {
        //private readonly IRepository<Department, Guid> _departmentRepo;
        private readonly DataContext _context;

        public DepartmentAppService(
            //IRepository<Department, Guid> departmentRepo,
            DataContext context
            )
        {
            //_departmentRepo = departmentRepo;
            _context = context;
        }

        public async Task<List<DepartmentForViewDto>> GetAll()
        {
            var list = await (from d in _context.Department
                                 select new DepartmentForViewDto
                                 {
                                     Id = d.Id,
                                     Name = d.Name,
                                     Icon = d.Icon,
                                     Color = d.Color,
                                     Boss = d.Boss,
                                     BossName = _context.Employee.FirstOrDefault(e => e.Id == d.Boss && e.Status == Status.Approved).FullName,
                                 }).AsNoTracking().ToListAsync();
            return list;
        }
    }
}
