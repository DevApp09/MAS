using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;

namespace MAS.DataAccessLayer
{
    public class SurveyAssignmentRepository : GenericRepository<SurveyAssignment>
    {
        public SurveyAssignmentRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<SurveyAssignmentDTO> GetAll()
        {
            var data = (from sa in _context.SurveyAssignments.AsQueryable()
                        join s in _context.Surveys.AsQueryable() on sa.SurveyID equals s.SurveyID
                        //join sa in _context.SurveyAssignees.AsQueryable() on k.SurveyID equals sa.SurveyID
                        select new SurveyAssignmentDTO()
                        {
                            SurveyAssignmentID = sa.SurveyAssignmentID,
                            SurveyID = sa.SurveyID,
                            Survey = s.Name,
                            StartDate = sa.StartDate,
                            EndDate = sa.EndDate,
                            IsActive = sa.IsActive,
                            //AssigneeID = sa.AssigneeID
                        }).ToList();
            return data;
        }

        public bool IsExists(long surveyAssignmentID, long surveyID, DateTime startDate, DateTime endDate)
        {
            var data = (from sa in _context.SurveyAssignments.AsQueryable()
                        where sa.SurveyAssignmentID != surveyAssignmentID
                            && sa.SurveyID == surveyID
                            && ((startDate >= sa.StartDate && endDate <= sa.StartDate)
                                || (endDate >= sa.EndDate && endDate <= sa.EndDate))
                        select sa.SurveyAssignmentID).Any();
            return data;
        }

        public SurveyAssignmentDTO GetById(long surveyAssignmentId)
        {
            var data = (from sa in _context.SurveyAssignments.AsQueryable()
                        where sa.SurveyAssignmentID == surveyAssignmentId
                        select new SurveyAssignmentDTO()
                        {
                            SurveyAssignmentID = sa.SurveyAssignmentID,
                            SurveyID = sa.SurveyID,
                            StartDate = sa.StartDate,
                            EndDate = sa.EndDate,
                            IsActive = sa.IsActive,
                        }).FirstOrDefault();
            data.AssigneeID = _context.SurveyAssignees.AsQueryable().Where(x => x.SurveyAssignmentID == surveyAssignmentId).Select(x => x.AssigneeID).ToArray();
            return data;
        }

        public IEnumerable<SurveyAssignmentDTO> GetAllSubmit(long surveyID)
        {
            var data = (from sas in _context.SurveyAssignees.AsQueryable()
                            //join sa in _context.SurveyAssignments.AsQueryable() on sas.SurveyAssignmentID equals sa.SurveyAssignmentID
                        join s in _context.Surveys.AsQueryable() on sas.SurveyID equals s.SurveyID
                        join ur in _context.Users.AsQueryable() on sas.AssigneeID equals ur.Id
                        where sas.SurveyID == surveyID && sas.RoleID != 3
                        select new SurveyAssignmentDTO()
                        {
                            //SurveyAssignmentID = sa.SurveyAssignmentID,
                            SurveyID = sas.SurveyID,
                            Survey = s.Name,
                            AssigneeUserName = ur.FullName,
                            AssignDate = sas.CreatedOn ?? default(DateTime),
                            IsSubmitted = sas.IsSubmitted,
                            SubmittedDate = sas.SubmittedOn,
                            SurveyAssigneeID = sas.SurveyAssigneeID,
                            Status = sas.IsSubmitted ? "Submitted" : "Assigned"
                        }).ToList();
            return data;
        }

        public IEnumerable<SurveyAssignmentDTO> GetDeployAssignees(long surveyID)
        {
            var data = (from sas in _context.SurveyAssignees.AsQueryable()
                        join s in _context.Surveys.AsQueryable() on sas.SurveyID equals s.SurveyID
                        join ur in _context.Users.AsQueryable() on sas.AssigneeID equals ur.Id
                        where sas.SurveyID == surveyID
                        select new SurveyAssignmentDTO()
                        {
                            SurveyID = sas.SurveyID,
                            Survey = s.Name,
                            AssigneeUserName = ur.FullName,
                            AssignDate = sas.CreatedOn ?? default(DateTime),
                            SurveyAssigneeID = sas.SurveyAssigneeID,
                            IsSubmitted = sas.IsSubmitted,
                            Status = sas.IsSubmitted ? "Submitted" : "Assigned"
                        }).ToList();
            return data;
        }


        public SurveySubmitDTO GetSubmitById(long surveyAssigneeId)
        {
            //surveyAssigneeId=20;
            var data = (from sa in _context.SurveyAssignees.AsQueryable()
                        join s in _context.Surveys.AsQueryable() on sa.SurveyID equals s.SurveyID
                        join u in _context.Users.AsQueryable() on sa.AssigneeID equals u.Id
                        where sa.SurveyAssigneeID == surveyAssigneeId
                        select new SurveySubmitDTO()
                        {
                            SurveyAssignmentID = sa.SurveyAssignmentID,
                            SurveyID = sa.SurveyID,
                            SurveyAssigeeID = sa.SurveyAssigneeID,
                            Name = s.Name,
                            Assignee = u.FullName,
                            SubmittedDate = sa.SubmittedOn,
                            Status = sa.IsSubmitted ? "Submitted" : "Assigned"
                        }).FirstOrDefault();

            var dataSurveyQuestion = (from sq in _context.SurveyQuestions.AsQueryable()
                                      join s in _context.SurveySections.AsQueryable() on sq.SurveySectionID equals s.SurveySectionID
                                      join q in _context.Questions.AsQueryable() on sq.QuestionID equals q.QuestionID
                                      join qty in _context.QuestionTypeFormats.AsQueryable() on q.FormatID equals qty.ID into temp
                                      from t in temp.DefaultIfEmpty()
                                      where sq.SurveyID == data.SurveyID
                                      select new SurveyQuestion2DTO()
                                      {
                                          SurveyQuestionID = sq.SurveyQuestionID,
                                          SurveySectionID = sq.SurveySectionID,
                                          SurveySection = s.Name,
                                          QuestionID = sq.QuestionID,
                                          Question = q.Name,
                                          QuestionTypeID = q.QuestionTypeID,
                                          Sequence = sq.Sequence.Value,
                                          DoRecordGPS = q.DoRecordGPS ?? false,
                                          FormatID = q.FormatID,
                                          Format = t == null ? null : t.Format,
                                          Unit = q.Unit,
                                          IsAdvanced = q.IsAdvanced,
                                          CascadeDropDownMarkup = q.CascadeDropdownMarkup
                                      }).Distinct().ToList();

            var dataSurveyQuestionOption = (from sq in _context.SurveyQuestions.AsQueryable()
                                            join qo in _context.QuestionOptions.AsQueryable() on sq.QuestionID equals qo.QuestionID
                                            where sq.SurveyID == data.SurveyID
                                            select new QuestionOptionDTO()
                                            {
                                                QuestionOptionID = qo.QuestionOptionID,
                                                QuestionID = sq.QuestionID,
                                                Option = qo.Option,
                                            }).ToList();

            var dataSurveySubmit = (from ss in _context.SurveySubmissions.AsQueryable()
                                    where ss.SurveyAssigneeID == surveyAssigneeId
                                    select new SurveySubmitQuestionDTO()
                                    {
                                        SurveySubmissionID = ss.SurveySubmissionID,
                                        SurveyAssigneeID = ss.SurveyAssigneeID,
                                        SurveyID = ss.SurveyID,
                                        AssigneeID = ss.AssigneeID,
                                        QuestionID = ss.QuestionID,
                                        Answer = ss.Answer,
                                        QuestionOptionID = ss.QuestionOptionID,
                                        QuestionOption = ss.QuestionOption,
                                        Comment = ss.Comment,
                                        Latitude = ss.Latitude,
                                        Longitude = ss.Longitude

                                    }).ToList();

            data.SurveyQuestions = dataSurveyQuestion;
            data.SurveyQuestionOptions = dataSurveyQuestionOption;
            data.SurveySubmitQuestions = dataSurveySubmit;

            return data;
        }
    }
}
