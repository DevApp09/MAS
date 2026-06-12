using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class SurveyQuestionOptionDTO
    {
        public long QuestionOptionID { get; set; }
        public long QuestionID { get; set; }
        public string Option { get; set; }
        public bool IsDelete { get; set; }
        public int State { get; set; }
    }
    public class SurveyQuestionOptionsDTO
    {
        public List<SurveyQuestionOptionDTO> QuestionOptions { get; set; }
    }
}
