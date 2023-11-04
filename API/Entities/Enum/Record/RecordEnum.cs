using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Enum.Record
{
    public enum RecordStatus : short
    {
        New = 1,
        Pending = 2,
        Approved = 3,
        Rejected = 4,
    }
    public enum ConfirmStatus : short
    {
        New = 1,
        Confirm = 2,
        Complain = 3,
    }

    public enum OptionRequest : short
    {
        OffMorning = 1,
        OffAfternoon = 2,
        OffFullDay = 3,
        Late = 4,
        LeaveEarly = 5,
    }
}
