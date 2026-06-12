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
    public class SurveyAssigneeRepository : GenericRepository<SurveyAssignee>
    {
        public SurveyAssigneeRepository(GeneralDbContext context) : base(context)
        {
        }

        //public IEnumerable<UserDTO> GetAll()
        //{
        //    var data = (from u in _context.SurveyAssignees.AsQueryable()
        //                select new UserDTO()
        //                {
        //                    UserID = u.Id,
        //                    Name = u.FullName
        //                }).ToList();
        //    return data;
        //}
    }
}
