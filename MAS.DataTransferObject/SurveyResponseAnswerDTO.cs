using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class SurveyResponseAnswerDTO
    {
        public long SurveyAssigneeID { get; set; }
        public string Question { get; set; }
        public string Answer { get; set; }
    }
}