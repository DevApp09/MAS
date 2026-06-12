using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class QuestionTypeDTO
    {
        public int QuestionTypeID { get; set; }
        public string Name { get; set; }
        public bool IsActive { get; set; }
    }
}
