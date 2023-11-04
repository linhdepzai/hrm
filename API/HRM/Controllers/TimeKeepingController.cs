using Business.DTOs.TimeKeepingDto;
using CoreApiResponse;
using Database;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HRM.Controllers
{
    public class TimeKeepingController : BaseApiController
    {
        private readonly DataContext _dataContext;

        public TimeKeepingController(DataContext dataContext)
        {
            _dataContext = dataContext;
        }
        [HttpGet("{userId}/get-timeKeeping-for-user")]
        public async Task<IActionResult> GetTimeKeepingForUser(Guid userId, int month, int year)
        {
            var timekeeping = await (from t in _dataContext.TimeKeeping
                                     where t.UserId == userId && t.Date.Month == month && t.Date.Year == year
                                     select new
                                     {
                                         Id = t.Id,
                                         UserId = t.UserId,
                                         Date = t.Date,
                                         Checkin = t.Checkin,
                                         PhotoCheckin = t.PhotoCheckin,
                                         Checkout = t.Checkout,
                                         PhotoCheckout = t.PhotoCheckout,
                                         Complain = t.Complain,
                                         Punish = t.Punish,
                                     }).AsNoTracking().Take(30).ToListAsync();
            return CustomResult(timekeeping);
        }
        [HttpPost("{userId}/checkin-or-checkout")]
        public async Task<IActionResult> CheckinOrCheckout(Guid userId, CreateTimeKeepingDto input)
        {
            if (input.PhotoCheckout != null)
            {
                var checkout = new CheckoutDto
                {
                    Checkout = input.Checkout.AddHours(7),
                    PhotoCheckout = input.PhotoCheckout,
                };
                return await CheckOut(userId, checkout);
            } else
            {
                var checkin = new CheckinDto
                {
                    Checkin = input.Checkin.AddHours(7),
                    PhotoCheckin = input.PhotoCheckin,
                };
                return await CheckIn(userId, checkin);
            }
        }
        private async Task<IActionResult> CheckIn(Guid userId, CheckinDto input)
        {
            var checkinToday = await _dataContext.TimeKeeping.AsNoTracking().FirstOrDefaultAsync(i => i.UserId == userId && (
                i.Date.Year == DateTime.Now.Year && i.Date.Month == DateTime.Now.Month && i.Date.Date == DateTime.Now.Date));
            if (checkinToday != null)
            {
                checkinToday.Checkin = input.Checkin;
                checkinToday.PhotoCheckin = input.PhotoCheckin;
                checkinToday.LastModifierUserId = userId;
            }
            _dataContext.TimeKeeping.Update(checkinToday);
            await _dataContext.SaveChangesAsync();
            return CustomResult(checkinToday);
        }
        private async Task<IActionResult> CheckOut(Guid userId, CheckoutDto input)
        {
            var checkoutToday = await _dataContext.TimeKeeping.AsNoTracking().FirstOrDefaultAsync(i => i.UserId == userId && (
                i.Date.Year == DateTime.Now.Year && i.Date.Month == DateTime.Now.Month && i.Date.Date == DateTime.Now.Date));
            if (checkoutToday != null)
            {
                checkoutToday.Checkout = input.Checkout;
                checkoutToday.PhotoCheckout = input.PhotoCheckout;
                checkoutToday.LastModifierUserId = userId;
            }
            _dataContext.TimeKeeping.Update(checkoutToday);
            await _dataContext.SaveChangesAsync();
            return CustomResult(checkoutToday);
        }
        [HttpPut("{userId}/complain-daily-checkin")]
        public async Task<IActionResult> ComplainDailyCheckin(Guid userId, ComplainDailyCheckinDto input)
        {
            var checkinComplain = await _dataContext.TimeKeeping.FindAsync(input.Id);
            if (checkinComplain != null)
            {
                checkinComplain.Complain = input.Complain;
            }
            _dataContext.TimeKeeping.Update(checkinComplain);
            await _dataContext.SaveChangesAsync();
            return CustomResult(checkinComplain);
        }
    }
}
