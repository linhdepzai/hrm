using System;

namespace Entities.Interfaces
{
    public interface IHasLastModificationTime
    {
        DateTime? LastModificationTime { get; set; }
    }
}
