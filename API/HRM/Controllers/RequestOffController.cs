using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Database;
using Entities;
using Business.DTOs.OnLeaveDto;
using Entities.Enum.Record;
using Business.DTOs.RequestOffDto;
using System.Runtime.Intrinsics.X86;

namespace HRM.Controllers
{
    public class RequestOffController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public RequestOffController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("{userId}/get-all-for-current-user")]
        public async Task<IActionResult> GetAll(Guid userId)
        {
            var list = await _dataContext.RequestOff.Where(i => i.UserId == userId && i.IsDeleted == false).AsNoTracking().ToListAsync();
            return CustomResult(list);
        }
        [HttpGet("{userId}/get-all-request")]
        public async Task<IActionResult> GetAllRequest(Guid userId)
        {
            var user = await _dataContext.Employee.FirstOrDefaultAsync(i => i.AppUserId == userId);
            var role = await (from u in _dataContext.AppUserRole
                              join r in _dataContext.AppRole on u.RoleId equals r.Id
                              where u.UserId == userId
                              select new
                              {
                                Role = r.Name,
                              }).AsNoTracking().ToListAsync();
            var data = await (from r in _dataContext.RequestOff
                              join u in _dataContext.AppUser on r.UserId equals u.Id
                              join e in _dataContext.Employee on u.Id equals e.AppUserId
                              where r.IsDeleted == false && e.Status == RecordStatus.Approved
                              select new RequestOffForViewDto
                              {
                                  Id = r.Id,
                                  UserId = r.UserId,
                                  AvatarUser = u.AvatarUrl,
                                  Name = e.FullName,
                                  DayOff = r.DayOff,
                                  Option = r.Option,
                                  Reason = r.Reason,
                                  Status = r.Status,
                                  IsAction = e.Manager == userId ? true : false,
                                  CreationTime = r.CreationTime,
                                  LastModificationTime = r.LastModificationTime,
                                  LastModifierUserId = _dataContext.Employee.FirstOrDefault(i => i.Status == RecordStatus.Approved && i.AppUserId == r.LastModifierUserId).FullName,
                              }).AsNoTracking().ToListAsync();
            if (role.FirstOrDefault(i => i.Role == "Admin") is not null) return CustomResult(data);
            var list = from r in data
                       join e in _dataContext.Employee on r.UserId equals e.AppUserId
                       where e.Status == RecordStatus.Approved && (e.Manager == user.Manager || e.Manager == userId)
                       select r;
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
