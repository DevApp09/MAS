using MAS.EntityFramework.General;
using MAS.EntityFramework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataAccessLayer
{
    public class MeetingAgendaRepository : GenericRepository<MeetingAgenda>
    {
        public MeetingAgendaRepository(GeneralDbContext context) : base(context)
        {
        }
    }
}
