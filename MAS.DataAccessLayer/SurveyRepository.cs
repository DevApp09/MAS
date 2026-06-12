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
    public class SurveyRepository : GenericRepository<Survey>
    {
        public SurveyRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<SurveyDTO> GetAll(int roleId, int userID, int categoryID, bool? isActive)
        {
            var data = (from s in _context.Surveys.AsQueryable()
                        join c in _context.Categories.AsQueryable() on s.CategoryID equals c.CategoryID
                        where (null == isActive || s.IsActive == isActive) && ((roleId == 2) || (roleId == 3 && (from sa in _context.SurveyAssignees
                                                                                                                 where sa.AssigneeID == userID && sa.RoleID == 3
                                                                                                                 select sa).Any()))
                        && s.CategoryID == categoryID
                        select new SurveyDTO()
                        {
                            SurveyID = s.SurveyID,
                            CategoryID = s.CategoryID,
                            Category = c.Name,
                            Name = s.Name,
                            Description = s.Description,
                            IsActive = s.IsActive,
                            NumberOfQuestion = 0,
                        }).ToList();
            return data;
        }

        public bool IsExists(long surveyID, string name)
        {
            bool data = (from s in _context.Surveys.AsQueryable()
                         where s.SurveyID != surveyID
                             && s.Name.ToLower() == name.ToLower()
                         select s).Any();
            return data;
        }

        public Survey2DTO GetInfoById(long surveyID)
        {
            var data = (from s in _context.Surveys.AsQueryable()
                        join c in _context.Categories.AsQueryable() on s.CategoryID equals c.CategoryID
                        where s.SurveyID == surveyID
                        select new Survey2DTO
                        {
                            SurveyID = s.SurveyID,
                            CategoryID = s.CategoryID,
                            Category = c.Name,
                            Name = s.Name,
                            Description = s.Description,
                            IsActive = s.IsActive
                        }).FirstOrDefault();

            if (data != null)
            {
                var questions = (from sq in _context.SurveyQuestions.AsQueryable()
                                 join q in _context.Questions.AsQueryable() on sq.QuestionID equals q.QuestionID
                                 join ss in _context.SurveySections.AsQueryable() on sq.SurveySectionID equals ss.SurveySectionID
                                 where sq.SurveyID == surveyID
                                 select new SurveyQuestionDTO()
                                 {
                                     QuestionID = q.QuestionID,
                                     QuestionTypeID = q.QuestionTypeID,
                                     IsRequired = q.IsRequired,
                                     Name = q.Name,
                                     Hint = q.Hint,
                                     Length = q.Length,
                                     IsNotApplicableOption = q.IsNotApplicableOption.Value,
                                     IsDontKnowOption = q.IsDontKnowOption.Value,
                                     IsAdvanced = q.IsAdvanced.Value,
                                     Comments = q.Comments,
                                     IsActive = q.IsActive,
                                     IsDelete = false,
                                     State = 4,
                                     SectionID = ss.SurveySectionID,
                                     SectionName = ss.Name,
                                     DoRecordGPS = q.DoRecordGPS ?? false,
                                     FormatID = q.FormatID,
                                     Unit = q.Unit,
                                     CascadeDropDownMarkup = q.CascadeDropdownMarkup
                                 }).ToList();
                data.Questions = questions;

                long[] questionIDs = questions.Select(s => s.QuestionID).ToArray();

                var options = (from qo in _context.QuestionOptions.AsQueryable()
                               where questionIDs.Contains(qo.QuestionID)
                               select new SurveyQuestionOptionDTO()
                               {
                                   QuestionOptionID = qo.QuestionOptionID,
                                   QuestionID = qo.QuestionID,
                                   Option = qo.Option,
                                   IsDelete = false,
                                   State = 4,
                               }).ToList();
                data.QuestionOptions = options;
            }

            return data;
        }
    }
}
