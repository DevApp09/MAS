using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class QuestionConditionDTO
    {
        public long QuestionConditionID { get; set; }
        public long QuestionID { get; set; }
        public long ConditionQuestionID { get; set; }
        public string Question { get; set; }
        public int ConditionID { get; set; }
        public string Condition { get; set; }
        public int? ConditionKey { get; set; }
        public string ConditionValue { get; set; }
        public bool IsDelete { get; set; }
    }
}
