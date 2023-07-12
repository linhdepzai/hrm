using System;
using System.Linq;
using System.Threading.Tasks;
using static Entities.Interface.IEntity;

namespace Business.Repository
{
    public interface IRepository<TEntity, TPrimaryKey> where TEntity : class, IEntity<TPrimaryKey>
    {
        // Return enitty
        IQueryable<TEntity> GetAll();
        // Get single entity 
        Task<TEntity?> GetAsync(TPrimaryKey id, CancellationToken cancellationToken = default);
        // Insert and return id of entity
        Task<TPrimaryKey> InsertAndGetIdAsync(TEntity entity, CancellationToken cancellationToken = default);
        // Insert entity
        Task<TEntity> InsertAsync(TEntity entity, CancellationToken cancellationToken = default);
        // Update enity
        Task<TEntity> UpdateAsync(TEntity entity, CancellationToken cancellationToken = default);
        // Soft delete entity
        Task DeleteAsync(TPrimaryKey id, CancellationToken cancellationToken = default);

        Task AddRangeAsync(ICollection<TEntity> entity, CancellationToken cancellationToken = default);

        Task UpdateRangeAsync(ICollection<TEntity> entity, CancellationToken cancellationToken = default);

    }

    public interface IRepository<TEntity> : IRepository<TEntity, Guid> where TEntity : class, IEntity<Guid>
    {
    }
}
