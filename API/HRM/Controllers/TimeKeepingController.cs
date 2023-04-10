using HRM.Data;
using HRM.DTOs.TimeKeepingDto;
using HRM.Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HRM.Controllers
{
    [ApiController]
    [Route("api/timekeeping")]
    public class TimeKeepingController : ControllerBase
    {
        private readonly DataContext _dataContext;

        public TimeKeepingController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("getTimeKeepingForUser")]
        public async Task<ActionResult> GetTimeKeepingForUser(Guid id, int month, int year)
        {
            var timekeeping = await (from t in _dataContext.TimeKeeping
                                     where t.EmployeeId == id && t.Date.Month == month && t.Date.Year == year
                                     select new
                                     {
                                         Id = t.Id,
                                         EmployeeId = t.EmployeeId,
                                         Date = t.Date,
                                         Checkin = t.Checkin,
                                         PhotoCheckin = t.PhotoCheckin,
                                         Checkout = t.Checkout,
                                         PhotoCheckout = t.PhotoCheckout,
                                         Punish = t.Punish,
                                     }).AsNoTracking().Take(30).ToListAsync();
            return Ok(timekeeping);

        }
        [HttpPost("checkinOrCheckout")]
        public async Task<ActionResult> CheckinOrCheckout(CreateTimeKeepingDto input)
        {
            if (input.PhotoCheckout != null)
            {
                var checkout = new CheckoutDto
                {
                    EmployeeId = input.EmployeeId,
                    Checkout = input.Checkout.AddHours(7),
                    PhotoCheckout = input.PhotoCheckout,
                };
                return await CheckOut(checkout);
            } else
            {
                var checkin = new CheckinDto
                {
                    EmployeeId = input.EmployeeId,
                    Checkin = input.Checkin.AddHours(7),
                    PhotoCheckin = input.PhotoCheckin,
                };
                return await CheckIn(checkin);
            }
        }
        private async Task<ActionResult> CheckIn(CheckinDto input)
        {
            var checkinToday = await _dataContext.TimeKeeping.AsNoTracking().FirstOrDefaultAsync(i => i.EmployeeId == input.EmployeeId && (
                i.Date.Year == DateTime.Now.Year && i.Date.Month == DateTime.Now.Month && i.Date.Date == DateTime.Now.Date));
            if (checkinToday != null)
            {
                checkinToday.Checkin = input.Checkin;
                checkinToday.PhotoCheckin = input.PhotoCheckin;
            }
            _dataContext.TimeKeeping.Update(checkinToday);
            await _dataContext.SaveChangesAsync();
            return Ok(checkinToday);
        }
        private async Task<ActionResult> CheckOut(CheckoutDto input)
        {
            var checkoutToday = await _dataContext.TimeKeeping.AsNoTracking().FirstOrDefaultAsync(i => i.EmployeeId == input.EmployeeId && (
                i.Date.Year == DateTime.Now.Year && i.Date.Month == DateTime.Now.Month && i.Date.Date == DateTime.Now.Date));
            if (checkoutToday != null)
            {
                checkoutToday.Checkin = input.Checkout;
                checkoutToday.PhotoCheckin = input.PhotoCheckout;
            }
            _dataContext.TimeKeeping.Update(checkoutToday);
            await _dataContext.SaveChangesAsync();
            return Ok(checkoutToday);
        }
    }
}
