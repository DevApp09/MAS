using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class SurveyDTO
    {
        public long SurveyID { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int CategoryID { get; set; }
        public string Category { get; set; }
        public bool IsActive { get; set; }
        public int NumberOfQuestion { get; set; }
    }
}
