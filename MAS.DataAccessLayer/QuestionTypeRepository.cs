using System.Collections.Generic;
using System.Linq;
using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;

namespace MAS.DataAccessLayer
{
    public class QuestionTypeRepository : GenericRepository<QuestionType>
    {
        public QuestionTypeRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<QuestionTypeDTO> GetAll(bool? isActive)
        {
            var data = (from qt in _context.QuestionTypes.AsQueryable()
                        where (null == isActive || qt.IsActive == isActive)
                        select new QuestionTypeDTO()
                        {
                            QuestionTypeID = qt.QuestionTypeID,
                            Name = qt.Name,
                            IsActive = qt.IsActive
                        }).ToList();
            return data;
        }
    }
}
