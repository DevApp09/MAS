using System.Collections.Generic;
using System.Linq;
using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;

namespace MAS.DataAccessLayer
{
    public class KnowledgeTypeRepository : GenericRepository<KnowledgeType>
    {
        public KnowledgeTypeRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<KnowledgeTypeDTO> GetAll(bool? isActive)
        {
            var data = (from qt in _context.KnowledgeTypes.AsQueryable()
                        where (null == isActive || qt.IsActive == isActive)
                        select new KnowledgeTypeDTO()
                        {
                            KnowledgeTypeID = qt.KnowledgeTypeID,
                            Name = qt.Name,
                            IsActive = qt.IsActive
                        }).ToList();
            return data;
        }
    }
}
