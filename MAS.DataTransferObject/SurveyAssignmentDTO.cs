using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class SurveyAssignmentDTO
    {
        public long SurveyAssigneeID { get; set; }
        public long SurveyID { get; set; }
        public string Survey { get; set; }
        public int AssigneeUserID { get; set; }
        public string AssigneeUserName { get; set; }
        public DateTime AssignDate { get; set; }
        public DateTime? SubmittedDate { get; set; }
        public bool IsSubmitted { get; set; }
        public DateTime LastModifiedOn { get; set; }
        public string LastModifiedBy { get; set; }
        public string Status { get; set; }



        public int[] ManagerID { get; set; }
        public long SurveyAssignmentID { get; set; } = 0;
        public DateTime StartDate { get; set; } = default(DateTime);
        public DateTime EndDate { get; set; } = default(DateTime);
        public bool IsActive { get; set; }
        public int[] AssigneeID { get; set; }
    }
}
