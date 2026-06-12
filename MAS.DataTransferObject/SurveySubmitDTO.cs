using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class SurveySubmitDTO
    {
        public long? SurveyAssignmentID { get; set; }
        public long SurveyID { get; set; }
        public long SurveyAssigeeID { get; set; }
        public string Name { get; set; }
        public string Assignee { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public string Status { get; set; }
        public IEnumerable<SurveyQuestion2DTO> SurveyQuestions { get; set; }
        public IEnumerable<QuestionOptionDTO> SurveyQuestionOptions { get; set; }
        public IEnumerable<SurveySubmitQuestionDTO> SurveySubmitQuestions { get; set; }
    }
}
