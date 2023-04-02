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
        public async Task<ActionResult> GetTimeKeepingForUser(Guid id)
        {
            var timekeeping = await (from t in _dataContext.TimeKeeping
                                     where t.EmployeeId == id
                                     select new
                                     {
                                         Id = t.Id,
                                         EmployeeId = t.EmployeeId,
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
            if (input.Id != null)
            {
                var checkout = new CheckoutDto
                {
                    Id = input.Id,
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
            // check xem da co ban ghi ngay hom nay chua
            var checkDate = await _dataContext.TimeKeeping.AsNoTracking().FirstOrDefaultAsync(e =>
                e.EmployeeId == input.EmployeeId && (
                (input.Checkin.Year == e.Checkin.Year && input.Checkin.Month == e.Checkin.Month && input.Checkin.Date == e.Checkin.Date) ||
                (input.Checkin.Year == e.Checkout.Year && input.Checkin.Month == e.Checkout.Month && input.Checkin.Date == e.Checkout.Date)));
            if (checkDate != null) return Ok(checkDate);
            var timeWorking = await _dataContext.TimeWorking.AsNoTracking().FirstOrDefaultAsync(e => e.EmployeeId == input.EmployeeId);
            // Truong hop quen checkin
            if (timeWorking.AfternoonEndTime.Hour - input.Checkin.Hour < 2)
            {
                var payoff = new Payoff
                {
                    Id = new Guid(),
                    EmployeeId = input.EmployeeId,
                    Reason = "No check in",
                    Amount = 50000,
                    Date = DateTime.Now,
                };
                var checkout = new TimeKeeping
                {
                    Id = new Guid(),
                    EmployeeId = input.EmployeeId,
                    Checkout = input.Checkin,
                    PhotoCheckout = input.PhotoCheckin,
                    Punish = true,
                };
                await _dataContext.Payoff.AddAsync(payoff);
                await _dataContext.TimeKeeping.AddAsync(checkout);
                await _dataContext.SaveChangesAsync();
                return Ok(checkout);
            }
            // check di muon
            int timeLate = input.Checkin.Hour - timeWorking.MorningStartTime.Hour;
            int minuteLate = input.Checkin.Minute - timeWorking.MorningStartTime.Minute;
            var request = await _dataContext.OnLeave.AsNoTracking().FirstOrDefaultAsync(i => i.EmployeeId == input.EmployeeId && input.Checkin.Year == i.DateLeave.Year && input.Checkin.Month == i.DateLeave.Month && input.Checkin.Day == i.DateLeave.Day);
            if (request != null)
            {
                switch (request.Option)
                {
                    case Enum.OptionOnLeave.OffMorning:
                        timeLate = input.Checkin.Hour - timeWorking.AfternoonStartTime.Hour;
                        minuteLate = input.Checkin.Minute - timeWorking.AfternoonStartTime.Minute;

                        break;
                    case Enum.OptionOnLeave.Late:
                        timeLate = input.Checkin.Hour - timeWorking.MorningStartTime.Hour - 2;
                        break;
                    case Enum.OptionOnLeave.OffAfternoon:
                        //quen checkin + off chieu
                        if (timeWorking.MorningEndTime.Hour - input.Checkin.Hour < 2)
                        {
                            var payoff = new Payoff
                            {
                                Id = new Guid(),
                                EmployeeId = input.EmployeeId,
                                Reason = "No check in",
                                Amount = 50000,
                                Date = DateTime.Now,
                            };
                            var checkout = new TimeKeeping
                            {
                                Id = new Guid(),
                                EmployeeId = input.EmployeeId,
                                Checkout = input.Checkin,
                                PhotoCheckout = input.PhotoCheckin,
                                Punish = true,
                            };
                            await _dataContext.Payoff.AddAsync(payoff);
                            await _dataContext.TimeKeeping.AddAsync(checkout);
                            await _dataContext.SaveChangesAsync();
                            return Ok(checkout);
                        }
                        break;
                    default:
                        timeLate = input.Checkin.Hour - timeWorking.MorningStartTime.Hour;
                        minuteLate = input.Checkin.Minute - timeWorking.MorningStartTime.Minute;
                        break;
                }
            }
            bool punish = false;
            string reason = "";
            if (timeLate >= 1)
            {
                punish = true;
                reason = "Checkin Late " + timeLate + "h" + minuteLate + "min";
            }
            else
            {
                if (minuteLate > 15)
                {
                    punish = true;
                    reason = "Checkin Late " + minuteLate + "min";
                }
                else
                {
                    punish = false;
                }
            }
            var checkin = new TimeKeeping
            {
                Id = new Guid(),
                EmployeeId = input.EmployeeId,
                Checkin = input.Checkin,
                PhotoCheckin = input.PhotoCheckin,
                Punish = punish,
            };
            // neu di muon thi phat
            if (punish == true)
            {
                var payoff = new Payoff
                {
                    Id = new Guid(),
                    EmployeeId = input.EmployeeId,
                    Reason = reason,
                    Amount = 20000,
                    Date = DateTime.Now,
                };
                await _dataContext.Payoff.AddAsync(payoff);
            };
            await _dataContext.TimeKeeping.AddAsync(checkin);
            await _dataContext.SaveChangesAsync();
            return Ok(checkin);
        }
        private async Task<ActionResult> CheckOut(CheckoutDto input)
        {
            var checkout = await _dataContext.TimeKeeping.FindAsync(input.Id);
            if (checkout != null && checkout.PhotoCheckout == null)
            {
                var timeWorking = await _dataContext.TimeWorking.AsNoTracking().FirstOrDefaultAsync(e => e.EmployeeId == checkout.EmployeeId);
                int timeEarly = timeWorking.AfternoonEndTime.Hour - input.Checkout.Hour;
                int minuteEarly = timeWorking.AfternoonEndTime.Minute - input.Checkout.Minute;
                var request = await _dataContext.OnLeave.AsNoTracking().FirstOrDefaultAsync(i => i.EmployeeId == checkout.EmployeeId && input.Checkout.Year == i.DateLeave.Year && input.Checkout.Month == i.DateLeave.Month && input.Checkout.Date == i.DateLeave.Date);
                if (request != null)
                {
                    switch (request.Option)
                    {
                        case Enum.OptionOnLeave.LeaveEarly:
                            timeEarly = timeWorking.AfternoonEndTime.Hour - input.Checkout.Hour - 2;
                            break;
                        case Enum.OptionOnLeave.OffAfternoon:
                            timeEarly = timeWorking.MorningEndTime.Hour - input.Checkout.Hour;
                            minuteEarly = timeWorking.MorningEndTime.Minute - input.Checkout.Minute;
                            break;
                        default:
                            timeEarly = timeWorking.AfternoonEndTime.Hour - input.Checkout.Hour;
                            minuteEarly = timeWorking.AfternoonEndTime.Minute - input.Checkout.Minute;
                            break;
                    }
                }
                if(timeEarly >= 1)
                {
                    checkout.Punish = true;
                    var payoff = new Payoff
                    {
                        Id = new Guid(),
                        EmployeeId = checkout.EmployeeId,
                        Reason = "check out early" + timeEarly + "h" + minuteEarly + "min",
                        Amount = 20000,
                        Date = DateTime.Now,
                    };
                    await _dataContext.Payoff.AddAsync(payoff);
                } 
                else
                {
                    if (minuteEarly >= 1)
                    {
                        checkout.Punish = true;
                        var payoff = new Payoff
                        {
                            Id = new Guid(),
                            EmployeeId = checkout.EmployeeId,
                            Reason = "check out early" + minuteEarly + "min",
                            Amount = 20000,
                            Date = DateTime.Now,
                        };
                        await _dataContext.Payoff.AddAsync(payoff);
                    }
                }
                checkout.Checkout = input.Checkout;
                checkout.PhotoCheckout = input.PhotoCheckout;
            };
            _dataContext.TimeKeeping.Update(checkout);
            await _dataContext.SaveChangesAsync();
            return Ok(checkout);
        }
    }
}
