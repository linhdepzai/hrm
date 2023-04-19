using System;

namespace HRM.Interfaces
{
    public interface IEntity<T>
    {
        T Id { get; set; }
    }
    public interface IEntity : IEntity<Guid>
    {
    }
}
