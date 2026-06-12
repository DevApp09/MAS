using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class ConditionDTO
    {
        public int ConditionID { get; set; }
        public int QuestionTypeID { get; set; }
        public string QuestionType { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }
}
