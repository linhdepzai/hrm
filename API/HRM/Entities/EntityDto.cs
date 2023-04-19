using HRM.Interfaces;
using System;

namespace HRM.Entities
{
    public abstract class EntityDto<T> : IEntity<T?>
    {
        public T? Id { get; set; }
    }
    public abstract class EntityDto : IEntity<Guid?>
    {
        public Guid? Id { get; set; }
    }
}
