using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using System;
using System.Linq;
using CoreApiResponse;
using System.Collections.Generic;
using Database;
using Entities;
using Business.DTOs.OnLeaveDto;
using Entities.Enum;
using Entities.Enum.Record;
using Business.DTOs.RequestOffDto;

namespace HRM.Controllers
{
    public class RequestOffController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public RequestOffController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("{userId}/get-all")]
        public async Task<IActionResult> GetAll(Guid userId)
        {
            var list = await _dataContext.RequestOff.Where(i => i.UserId == userId && i.IsDeleted == false).AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpGet("{userId}/get-all-request")]
        public async Task<IActionResult> GetAllRequest(Guid userId)
        {
            var user = await _dataContext.Employee.FirstOrDefaultAsync(i => i.AppUserId == userId);
            var isAdmin = await (from u in _dataContext.AppUserRole
                                 join r in _dataContext.AppRole on u.RoleId equals r.Id
                                 where u.UserId == userId && r.Name == "Admin"
                                 select new
                                 {
                                     Role = r.Name,
                                 }).AsNoTracking().ToListAsync();
            if (isAdmin.Count > 0) return CustomResult(await _dataContext.RequestOff.Where(i => i.IsDeleted == false).AsNoTracking().ToListAsync());
            var list = new List<RequestOffForViewDto>();
            var isBoss = await _dataContext.Department.Where(i => i.Boss == user.AppUserId).AsNoTracking().ToListAsync();
            if (isBoss.Any())
            {
                foreach (var department in isBoss)
                {
                    var employees = await _dataContext.Employee.Where(i => i.DepartmentId == department.Id && i.Status == RecordStatus.Approved).AsNoTracking().ToListAsync();
                    foreach (var employee in employees)
                    {
                        var avt = await _dataContext.AppUser.FirstOrDefaultAsync(i => i.Id == employee.AppUserId);
                        var onleaveList = await _dataContext.RequestOff.Where(i => i.UserId == employee.Id && i.IsDeleted == false).AsNoTracking().ToListAsync();
                        foreach (var i in onleaveList)
                        {
                            var item = new RequestOffForViewDto { 
                                Id = i.Id,
                                UserId = i.UserId,
                                AvatarUser = avt.AvatarUrl,
                                DayOff = i.DayOff,
                                Option = i.Option,
                                Reason = i.Reason,
                                Status = i.Status,
                            };
                            list.Add(item);
                        }
                    }
                }
            }
            else
            {
                var department = await _dataContext.Department.FindAsync(user.DepartmentId);
                var employees = await _dataContext.Employee.Where(i => i.DepartmentId == department.Id && i.Status == RecordStatus.Approved).AsNoTracking().ToListAsync();
                foreach (var employee in employees)
                {
                    var onleaveList = await _dataContext.RequestOff.Where(i => i.UserId == employee.AppUserId && i.IsDeleted == false).AsNoTracking().ToListAsync();
                    var avt = await _dataContext.AppUser.FirstOrDefaultAsync(i => i.Id == employee.AppUserId);
                    foreach (var i in onleaveList)
                    {
                        var item = new RequestOffForViewDto
                        {
                            Id = i.Id,
                            UserId = i.UserId,
                            AvatarUser = avt.AvatarUrl,
                            DayOff = i.DayOff,
                            Option = i.Option,
                            Reason = i.Reason,
                            Status = i.Status,
                        };
                        list.Add(item);
                    }
                }
            }
            return CustomResult(list);
        }
        [HttpPost("{userId}/request-off")]
        public async Task<IActionResult> Create(List<CreateOrEditRequestOffDto> input, Guid userId)
        {
            foreach (var i in input)
            {
                var checkLeave = await _dataContext.RequestOff.AsNoTracking().FirstOrDefaultAsync(e => e.UserId == userId && e.DayOff == i.DayOff && e.IsDeleted == false);
                if (checkLeave != null)
                {
                    checkLeave.Option = i.Option;
                    checkLeave.Reason = i.Reason;
                    _dataContext.RequestOff.Update(checkLeave);
                }
                else
                {
                    var requestOff = new RequestOff
                    {
                        Id = new Guid(),
                        UserId = userId,
                        DayOff = i.DayOff,
                        Option = i.Option,
                        Reason = i.Reason,
                        Status = RecordStatus.Pending,
                    };
                    await _dataContext.RequestOff.AddAsync(requestOff);
                }
            };
            await _dataContext.SaveChangesAsync();
            return CustomResult(input);
        }

        [HttpDelete("{userId}/delete")]
        public async Task<IActionResult> Delete(Guid userId, Guid id)
        {
            _dataContext.RequestOff.Remove(await _dataContext.RequestOff.FindAsync(id));
            await _dataContext.SaveChangesAsync();
            return CustomResult(id);
        }

        [HttpPut("{userId}/update-status")]
        public async Task<IActionResult> updateStatus(Guid userId, UpdateStatusRequestOffDto input)
        {
            var item = await _dataContext.RequestOff.FindAsync(input.Id);
            if (item != null)
            {
                item.LastModifierUserId = userId;
                item.Status = input.Status;
            }
            _dataContext.Update(item);
            await _dataContext.SaveChangesAsync();
            return CustomResult(item);
        }
    }
}
