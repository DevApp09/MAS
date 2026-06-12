using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class SurveySubmitQuestionDTO
    {
        public long SurveySubmissionID { get; set; }
        public long SurveyAssigneeID { get; set; }
        public long SurveyID { get; set; }
        public int AssigneeID { get; set; }
        public long QuestionID { get; set; }
        public string Answer { get; set; }
        public long? QuestionOptionID { get; set; }
        public string QuestionOption { get; set; }
        public string Comment { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
    }
}
