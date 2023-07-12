using Entities.Interfaces;
using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using static Entities.Interface.IEntity;

namespace Entities
{
    public class BaseEntity<T> : IEntity<T>, IHasCreatorUserId, IHasLastModifierUserId, ISoftDelete
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public virtual T Id { get; set; }
        public virtual Guid? CreatorUserId { get; set; }
        [DataType(DataType.DateTime)]
        public virtual DateTime? CreationTime { get; set; }
        public virtual Guid? LastModifierUserId { get; set; }
        [DataType(DataType.DateTime)]
        public virtual DateTime? LastModificationTime { get; set; }
        public virtual Guid? DeleteUserId { get; set; }
        [DataType(DataType.DateTime)]
        public virtual DateTime? DeletionTime { get; set; }
        public virtual bool IsDeleted { get; set; }
    }

    public abstract class BaseEntity : BaseEntity<Guid>
    {
    }
}
