using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;

namespace MAS.DataAccessLayer
{
    public class SurveyQuestionRepository : GenericRepository<SurveyQuestion>
    {
        public SurveyQuestionRepository(GeneralDbContext context) : base(context)
        {
        }

        //public IEnumerable<SurveyDTO> GetAll(bool? isActive)
        //{
        //    var data = (from s in _context.Surveys.AsQueryable()
        //                join c in _context.Categories.AsQueryable() on s.CategoryID equals c.CategoryID
        //                where (null == isActive || s.IsActive == isActive)
        //                select new SurveyDTO()
        //                {
        //                    SurveyID = s.SurveyID,
        //                    CategoryID = s.CategoryID,
        //                    Category = c.Name,
        //                    Name = s.Name,
        //                    IsActive = s.IsActive,
        //                    NumberOfQuestion = 0,
        //                }).ToList();
        //    return data;
        //}

        //public bool IsExists(long surveyID, string name)
        //{
        //    bool data = (from s in _context.Surveys.AsQueryable()
        //                 where s.SurveyID != surveyID
        //                     && s.Name.ToLower() == name.ToLower()
        //                 select s).Any();
        //    return data;
        //}
    }
}
