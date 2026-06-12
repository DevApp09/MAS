using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using MAS.EntityFramework;
using MAS.EntityFramework.General;

namespace MAS.DataAccessLayer
{
    public class GenericRepository<TEntity> where TEntity : class
    {
        protected GeneralDbContext _context;
        protected DbSet<TEntity> _DbSet;

        public GenericRepository(GeneralDbContext context)
        {
            this._context = context;
            this._DbSet = context.Set<TEntity>();
        }

        public virtual IEnumerable<TEntity> Get()
        {
            IQueryable<TEntity> query = _DbSet;
            return query.ToList();
        }

        public virtual TEntity GetByID(object id)
        {
            return _DbSet.Find(id);
        }

        public virtual void Insert(TEntity entity)
        {
            _DbSet.Add(entity);
        }

        public virtual void Delete(object id)
        {
            TEntity entityToDelete = _DbSet.Find(id);
            Delete(entityToDelete);
        }

        public virtual void Delete(TEntity entityToDelete)
        {
            if (_context.Entry(entityToDelete).State == EntityState.Detached)
            {
                _DbSet.Attach(entityToDelete);
            }
            _DbSet.Remove(entityToDelete);
        }

        public virtual void Update(TEntity entityToUpdate)
        {
            _DbSet.Attach(entityToUpdate);
            _context.Entry(entityToUpdate).State = EntityState.Modified;
        }

        public virtual IEnumerable<TEntity> GetMany(Func<TEntity, bool> where)
        {
            return _DbSet.Where(where).ToList();
        }

        //public virtual IQueryable<TEntity> GetManyQueryable(Func<TEntity, bool> where)
        //{
        //return _DbSet.Where(where).AsQueryable();
        //}

        public virtual TEntity Get(Func<TEntity, Boolean> where)
        {
            return _DbSet.Where(where).FirstOrDefault<TEntity>();
        }

        public void Delete(Func<TEntity, Boolean> where)
        {
            IQueryable<TEntity> objects = _DbSet.Where<TEntity>(where).AsQueryable();
            foreach (TEntity obj in objects)
                _DbSet.Remove(obj);
        }

        public virtual IEnumerable<TEntity> GetAll()
        {
            return _DbSet.ToList();
        }

        public IQueryable<TEntity> GetWithInclude(
            System.Linq.Expressions.Expression<Func<TEntity,
            bool>> predicate, params string[] include)
        {
            IQueryable<TEntity> query = this._DbSet;
            query = include.Aggregate(query, (current, inc) => current.Include(inc));
            return query.Where(predicate);
        }

        public bool Exists(object primaryKey)
        {
            return _DbSet.Find(primaryKey) != null;
        }

        public virtual TEntity GetSingle(Func<TEntity, bool> predicate)
        {
            return _DbSet.Single<TEntity>(predicate);
        }

        public virtual TEntity GetFirst(Func<TEntity, bool> predicate)
        {
            return _DbSet.First<TEntity>(predicate);
        }

        public void DeleteAll(IEnumerable<TEntity> entities)
        {
            _DbSet.RemoveRange(entities);
        }
    }
}
