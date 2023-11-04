using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Enum.Project
{
    public enum MemberType : short
    {
        ProjectManager = 1,
        Member = 2,
    }
    public enum Priority : short
    {
        Normal = 1,
        Low = 2,
        Medium = 3,
        High = 4,
        Urgent = 5
    }

    public enum WorkStatus : short
    {
        Reopened = 1,
        Open = 2,
        InProgress = 3,
        Resolve = 4,
        Closed = 5
    }

    public enum ProjectType : short
    {
        TM = 1,
        FF = 2,
        NB = 3,
        ODC = 4,
        Product = 5,
        Training = 6,
    }
}
