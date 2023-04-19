using System;

namespace HRM.Interfaces
{
    public interface IHasCreatorUserId : IHasCreationTime
    {
        Guid? CreatorUserId { get; set; }
    }
}
