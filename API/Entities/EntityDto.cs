using static Entities.Interface.IEntity;

namespace Entities
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
