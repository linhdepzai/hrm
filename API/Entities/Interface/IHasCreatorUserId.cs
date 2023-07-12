using System;

namespace Entities.Interfaces
{
    public interface IHasCreatorUserId : IHasCreationTime
    {
        Guid? CreatorUserId { get; set; }
    }
}
