using System;
using System.Collections.Generic;
using System.Linq;
using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;

namespace MAS.DataAccessLayer
{
    public class QuestionOptionRepository : GenericRepository<QuestionOption>
    {
        public QuestionOptionRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<QuestionOptionDTO> GetAll(bool? isActive, long questionID)
        {
            var data = (from qo in _context.QuestionOptions.AsQueryable()
                        where (null == isActive || qo.IsActive == isActive)
                            && (-1 == questionID || qo.QuestionID == questionID)
                        select new QuestionOptionDTO()
                        {
                            QuestionOptionID = qo.QuestionOptionID,
                            QuestionID = qo.QuestionID,
                            Option = qo.Option,
                            IsActive = qo.IsActive
                        }).ToList();
            return data;
        }
        public override QuestionOption GetFirst(Func<QuestionOption, bool> predicate)
        {
            return _context.QuestionOptions.AsQueryable().First<QuestionOption>(predicate);
        }
    }
}
