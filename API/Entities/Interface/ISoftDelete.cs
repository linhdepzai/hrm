using System;

namespace Entities.Interfaces
{
    public interface ISoftDelete
    {
        Guid? DeleteUserId { get; set; }
        DateTime? DeletionTime { get; set; }
        bool IsDeleted { get; set; }
    }
}
