using System;
namespace HRM.Interfaces
{
    public interface IHasLastModifierUserId : IHasLastModificationTime
    {
        Guid? LastModifierUserId {get; set;}
    }
}
