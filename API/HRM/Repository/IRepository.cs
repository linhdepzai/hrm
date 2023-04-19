using HRM.Interfaces;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace HRM.Repository
{
    public interface IRepository<TEntity, TPrimaryKey> where TEntity : class, IEntity<TPrimaryKey>
    {
        IQueryable<TEntity> GetAll();
        Task<TEntity?> GetAsync(TPrimaryKey id);
        Task<TPrimaryKey> InsertAndGetIdAsync(TEntity entity);
        Task<TEntity> InsertAsync(TEntity entity);
        Task<TEntity> UpdateAsync(TEntity entity);
        Task DeleteAsync(TPrimaryKey id);
    }

    public interface IRepository<TEntity> : IRepository<TEntity, Guid> where TEntity : class, IEntity<Guid>
    {
    }
}
