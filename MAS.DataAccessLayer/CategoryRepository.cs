using System.Collections.Generic;
using System.Linq;
using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;

namespace MAS.DataAccessLayer
{
    public class CategoryRepository : GenericRepository<Category>
    {
        public CategoryRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<CategoryDTO> GetAll(bool? isActive)
        {
            var data = (from c in _context.Categories.AsQueryable()
                        where (null == isActive || c.IsActive == isActive)
                        select new CategoryDTO()
                        {
                            CategoryID = c.CategoryID,
                            Name = c.Name,
                            IsActive = c.IsActive
                        }).ToList();
            return data;
        }

        public IEnumerable<KeyValuePair<int, string>> GetAllKeyValuePair(bool? isActive)
        {
            var keyValue = new List<KeyValuePair<int, string>>();

            var data = (from c in _context.Categories.AsQueryable()
                        where (null == isActive || c.IsActive == isActive)
                        select new { key = c.CategoryID, value = c.Name })
                            .Distinct()
                            .ToArray();

            foreach (var d in data)
            {
                keyValue.Add(new KeyValuePair<int, string>(d.key, d.value));
            }

            return keyValue;
        }
    }
}
