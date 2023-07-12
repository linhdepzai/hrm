using System;
namespace Entities.Interfaces
{
    public interface IHasLastModifierUserId : IHasLastModificationTime
    {
        Guid? LastModifierUserId {get; set;}
    }
}
