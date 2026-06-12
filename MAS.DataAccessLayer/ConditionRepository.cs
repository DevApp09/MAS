using System.Collections.Generic;
using System.Linq;
using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;

namespace MAS.DataAccessLayer
{
    public class ConditionRepository : GenericRepository<Condition>
    {
        public ConditionRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<ConditionDTO> GetAll(bool? isActive)
        {
            var data = (from c in _context.Conditions.AsQueryable()
                        join qt in _context.QuestionTypes.AsQueryable() on c.QuestionTypeID equals qt.QuestionTypeID
                        where (null == isActive || c.IsActive == isActive)
                        select new ConditionDTO()
                        {
                            ConditionID = c.ConditionID,
                            QuestionTypeID = c.QuestionTypeID,
                            QuestionType = qt.Name,
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
