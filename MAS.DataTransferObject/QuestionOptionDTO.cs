using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class QuestionOptionDTO
    {
        public long QuestionOptionID { get; set; }
        public long QuestionID { get; set; }
        public string Question { get; set; }
        public string Option { get; set; }
        public bool IsActive { get; set; }
        public bool IsDelete { get; set; }
    }
}
