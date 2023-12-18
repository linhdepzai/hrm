using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Enum.Recuitment
{
    public enum StatusCandidate : short
    {
        Waiting = 1,
        Failure = 2,
        PassCV = 3,
        PassInterview = 4,
        Rejected = 5,
        Success = 6,
    }
}
