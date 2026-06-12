using System;
using System.Collections.Generic;
using System.Linq;
using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;

namespace MAS.DataAccessLayer
{
    public class QuestionConditionRepository : GenericRepository<QuestionCondition>
    {
        public QuestionConditionRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<QuestionConditionDTO> GetAll(long questionID)
        {
            var data = (from qc in _context.QuestionConditions.AsQueryable()
                        //join q in _context.Questions on qc.QuestionID equals q.QuestionID
                        //join c in _context.Conditions on qc.ConditionID equals c.ConditionID
                        where (-1 == questionID || qc.QuestionID == questionID)
                        select new QuestionConditionDTO()
                        {
                            QuestionConditionID = qc.QuestionConditionID,
                            ConditionQuestionID = qc.ConditionQuestionID,
                            QuestionID = qc.QuestionID,
                            //Question = q.Name,
                            ConditionID = qc.ConditionID,
                            //Condition = c.Name,
                            ConditionKey = qc.ConditionKey,
                            ConditionValue = qc.ConditionValue,
                        }).ToList();
            return data;
        }
    }
}
