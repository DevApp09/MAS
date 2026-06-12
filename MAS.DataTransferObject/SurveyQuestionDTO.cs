using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class SurveyQuestionDTO
    {
        public long QuestionID { get; set; }
        public int QuestionTypeID { get; set; }
        public bool IsRequired { get; set; }
        public string Name { get; set; }
        public string Hint { get; set; }
        public int Length { get; set; } = 0;
        public bool IsNotApplicableOption { get; set; }
        public bool IsDontKnowOption { get; set; }
        public bool IsAdvanced { get; set; }
        public bool DoRecordGPS { get; set; }
        public string Comments { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
        public int State { get; set; }
        public long SectionID { get; set; }
        public string SectionName { get; set; }
        public bool IsSectionDeleted { get; set; } = false;
        public int? FormatID { get; set; }
        public string Unit { get; set; }
        public string CascadeDropDownMarkup { get; set; }
    }
}
