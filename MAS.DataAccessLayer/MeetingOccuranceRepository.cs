using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataAccessLayer
{
    public class MeetingOccuranceRepository : GenericRepository<MeetingOccurance>
    {
        public MeetingOccuranceRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<MeetingOccuranceDTO> GetAll2(bool? isActive)
        {
            var data = (from qt in _context.MeetingOccurances.AsQueryable()
                        where (null == isActive || qt.IsActive == isActive)
                        select new MeetingOccuranceDTO()
                        {
                            MeetingOccuranceID = qt.MeetingOccuranceID,
                            Name = qt.Name,
                            IsActive = qt.IsActive
                        }).ToList();
            return data;
        }
    }
}
