using MAS.EntityFramework;
using MAS.EntityFramework.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataAccessLayer
{
    public class SurveySubmissionRepository : GenericRepository<SurveySubmission>
    {
        public SurveySubmissionRepository(GeneralDbContext context) : base(context)
        {
        }
        public bool IsExists(long surveyAssigneeID)
        {
            var data = (from ss in _context.SurveySubmissions.AsQueryable()
                        where ss.SurveyAssigneeID == surveyAssigneeID
                        select ss.SurveySubmissionID).Any();
            return data;
        }
    }
}
