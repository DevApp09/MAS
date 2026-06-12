using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class SurveyQuestionConditionDTO
    {
        public long QuestionConditionID { get; set; }
        public long QuestionID { get; set; }
        public long ConditionQuestionID { get; set; }
        public int ConditionID { get; set; }
        public bool IsDelete { get; set; }
        public int State { get; set; }
    }
    public class SurveyQuestionConditionsDTO
    {
        public List<SurveyQuestionConditionDTO> QuestionConditions { get; set; }
    }
}
