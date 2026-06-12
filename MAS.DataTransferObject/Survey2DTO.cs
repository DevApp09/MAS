using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class Survey2DTO
    {
        public long SurveyID { get; set; }
        public int CategoryID { get; set; }
        public string Category { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public bool IsActive { get; set; }
        public int NumberOfQuestion { get; set; }
        

        public List<SurveyQuestionDTO> Questions { get; set; } = new List<SurveyQuestionDTO>();
        public List<SurveyQuestionOptionDTO> QuestionOptions { get; set; } = new List<SurveyQuestionOptionDTO>();
        public List<SurveyQuestionConditionDTO> QuestionConditions { get; set; } = new List<SurveyQuestionConditionDTO>();

    }
}
