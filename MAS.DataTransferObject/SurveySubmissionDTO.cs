using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class SurveySubmissionDTO
    {
        public long SurveyAssigneeID { get; set; }
        public List<AnswerData> Answers { get; set; } = new List<AnswerData>();
    }

    public class AnswerData
    {
        public long QuestionID { get; set; }
        public long QuestionTypeID { get; set; }
        public int OptionID { get; set; }
        public string Option { get; set; }
        public string Answer { get; set; }
    }
}


