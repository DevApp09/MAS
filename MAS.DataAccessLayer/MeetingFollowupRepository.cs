using MAS.EntityFramework;
using MAS.EntityFramework.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataAccessLayer
{
    public class MeetingFollowupRepository : GenericRepository<MeetingFollowup>
    {
        public MeetingFollowupRepository(GeneralDbContext context) : base(context)
        {
        }
    }
}
