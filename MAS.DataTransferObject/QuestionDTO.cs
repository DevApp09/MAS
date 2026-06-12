using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class QuestionDTO
    {
        public long QuestionID { get; set; }
        public int CategoryID { get; set; }
        public string Category { get; set; }
        public int QuestionTypeID { get; set; }
        public string QuestionType { get; set; }
        public string Name { get; set; }
        public bool IsRequired { get; set; }
        public string Hint { get; set; }
        public int Length { get; set; }
        public bool IsActive { get; set; }
        public bool IsNotApplicableOption { get; set; }
        public bool IsDontKnowOption { get; set; }
        public bool IsAdvanced { get; set; }
        public string Comments { get; set; }
        public IEnumerable<QuestionOptionDTO> QuestionOptions { get; set; }
        public IEnumerable<QuestionConditionDTO> QuestionConditions { get; set; }
    }
}
