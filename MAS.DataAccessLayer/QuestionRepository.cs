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
    public class QuestionRepository : GenericRepository<Question>
    {
        public QuestionRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<QuestionDTO> GetAll(int categoryID, int questionTypeID)
        {
            var data = (from q in _context.Questions.AsQueryable()
                        join c in _context.Categories.AsQueryable() on q.CategoryID equals c.CategoryID
                        join qt in _context.QuestionTypes.AsQueryable() on q.QuestionTypeID equals qt.QuestionTypeID
                        where (-1 == categoryID || q.CategoryID == categoryID)
                            && (-1 == questionTypeID || q.QuestionTypeID == questionTypeID)
                        select new QuestionDTO()
                        {
                            QuestionID = q.QuestionID,
                            CategoryID = q.CategoryID,
                            Category = c.Name,
                            QuestionTypeID = q.QuestionTypeID,
                            QuestionType =  qt.Name,
                            Name = q.Name,
                            IsRequired = q.IsRequired,
                            Hint = q.Hint,
                            Length = q.Length,
                            IsActive = q.IsActive
                        }).ToList();
            return data;
        }

        public IEnumerable<QuestionDTO> GetAll2(bool? isActive)
        {
            var data = (from q in _context.Questions.AsQueryable()
                        join c in _context.Categories.AsQueryable() on q.CategoryID equals c.CategoryID
                        join qt in _context.QuestionTypes.AsQueryable() on q.QuestionTypeID equals qt.QuestionTypeID
                        where (null == isActive || c.IsActive == isActive)
                        select new QuestionDTO()
                        {
                            QuestionID = q.QuestionID,
                            CategoryID = q.CategoryID,
                            Category = c.Name,
                            QuestionTypeID = q.QuestionTypeID,
                            QuestionType =  qt.Name,
                            Name = q.Name,
                            IsRequired = q.IsRequired,
                            Hint = q.Hint,
                            Length = q.Length,
                            IsActive = q.IsActive
                        }).ToList();
            return data;
        }

        public QuestionDTO GetInfoByID(long questionID)
        {
            var data = (from q in _context.Questions.AsQueryable()
                        join c in _context.Categories.AsQueryable() on q.CategoryID equals c.CategoryID
                        join qt in _context.QuestionTypes.AsQueryable() on q.QuestionTypeID equals qt.QuestionTypeID
                        where q.QuestionID == questionID
                        select new QuestionDTO
                        {
                            QuestionID = q.QuestionID,
                            CategoryID = q.CategoryID,
                            Category = c.Name,
                            QuestionTypeID = q.QuestionTypeID,
                            QuestionType =  qt.Name,
                            Name = q.Name,
                            IsRequired = q.IsRequired,
                            Hint = q.Hint,
                            Length = q.Length,
                            IsActive = q.IsActive
                        }).FirstOrDefault();

            if (data != null)
            {
                var questionOptions = (from qo in _context.QuestionOptions.AsQueryable()
                                       where qo.QuestionID == data.QuestionID
                                       select new QuestionOptionDTO()
                                       {
                                           QuestionOptionID = qo.QuestionOptionID,
                                           QuestionID = qo.QuestionID,
                                           Option = qo.Option,
                                           IsActive = qo.IsActive,
                                       }).ToArray();
                data.QuestionOptions = questionOptions;

                var questionConditions = (from qc in _context.QuestionConditions.AsQueryable()
                                          join q in _context.Questions on qc.ConditionQuestionID equals q.QuestionID
                                          join c in _context.Conditions on qc.ConditionID equals c.ConditionID
                                          where qc.QuestionID == data.QuestionID
                                          select new QuestionConditionDTO()
                                          {
                                              QuestionConditionID = qc.QuestionConditionID,
                                              QuestionID = qc.QuestionID,
                                              ConditionQuestionID = qc.ConditionQuestionID,
                                              Question = q.Name,
                                              ConditionID = qc.ConditionID,
                                              Condition = c.Name,
                                              ConditionKey = qc.ConditionKey,
                                              ConditionValue = qc.ConditionValue,
                                          }).ToArray();
                data.QuestionConditions = questionConditions;
            }

            return data;
        }
        public override Question GetFirst(Func<Question, bool> predicate)
        {
            return _context.Questions.AsQueryable().First<Question>(predicate);
        }

        public bool IsExists(long questionID, string name, int categoryID, int questionTypeID)
        {
            bool data = (from q in _context.Questions.AsQueryable()
                        where q.QuestionID != questionID
                            && q.Name.ToLower() == name.ToLower()
                            && q.CategoryID == categoryID
                            && q.QuestionTypeID == questionTypeID
                        select q).Any();
            return data;
        }

        public bool IsUsedInSurvey(long questionID)
        {
            bool data = (from q in _context.Questions.AsQueryable()
                        where q.QuestionID == questionID
                            && q.IsUsedInSurvey == true
                        select q).Any();
            return data;
        }

        //public Question GetByID(long questionID)
        //{
        //    var data = (from q in _context.Questions.AsQueryable()
        //                where q.QuestionID == questionID
        //                select q).FirstOrDefault();
        //    return data;
        //}
    }
}
