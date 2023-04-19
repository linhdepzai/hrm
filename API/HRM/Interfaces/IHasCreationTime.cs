using System;

namespace HRM.Interfaces
{
    public interface IHasCreationTime
    {
        DateTime? CreationTime { get; set; }
    }
}
