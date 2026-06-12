using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class KnowledgeDTO
    {
        public long KnowledgeID { get; set; }
        public int KnowledgeTypeID { get; set; }
        public string KnowledgeType { get; set; }
        public string Title { get; set; }
        public DateTime Date { get; set; }
        public string Description { get; set; }
        public string FileName { get; set; }
        public string InternalFileName { get; set; }
    }
}
