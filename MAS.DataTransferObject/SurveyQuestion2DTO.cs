using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class SurveyQuestion2DTO
    {
        public long SurveyQuestionID { get; set; }
        public long SurveySectionID { get; set; }
        public string SurveySection { get; set; }
        public long QuestionID { get; set; }
        public string Question { get; set; }
        public bool IsDelete { get; set; }
        public int Sequence { get; set; }
        public int QuestionTypeID { get; set; }
        public bool DoRecordGPS { get; set; }
        public int? FormatID { get; set; }
        public string Format { get; set; }
        public string Unit { get; set; }
        public string CascadeDropDownMarkup { get; set; }
        public bool? IsAdvanced { get; set; }

    }
}
