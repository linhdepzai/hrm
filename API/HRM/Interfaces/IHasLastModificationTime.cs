using System;

namespace HRM.Interfaces
{
    public interface IHasLastModificationTime
    {
        DateTime? LastModificationTime { get; set; }
    }
}
