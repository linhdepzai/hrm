using System;

namespace Entities.Interfaces
{
    public interface IHasCreationTime
    {
        DateTime? CreationTime { get; set; }
    }
}
