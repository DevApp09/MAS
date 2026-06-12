using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class MeetingDTO
    {
        public long MeetingID { get; set; }
        public int MeetingOccuranceID { get; set; }
        public string Occurance { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Version { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public string Location { get; set; }
        public bool IsPostpone { get; set; }
        public int PostponeBy { get; set; }
        public DateTime PostponeOn { get; set; }
        public string PostponeReason { get; set; }

        public string AgendaTitle { get; set; }
        public int AgendaAssigneeID { get; set; }
        public string AgendaComments { get; set; }

        public int[] AttendeeAssigneeID { get; set; }

    }
}
