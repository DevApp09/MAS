using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataAccessLayer
{
    public class MeetingRepository : GenericRepository<Meeting>
    {
        public MeetingRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<MeetingDTO> GetAll(int meetingOccuranceID)
        {
            var data = (from m in _context.Meetings.AsQueryable()
                        join mo in _context.MeetingOccurances.AsQueryable() on m.MeetingOccuranceID equals mo.MeetingOccuranceID
                        join f in _context.MeetingFollowups.AsQueryable() on m.MeetingID equals f.MeetingID
                        join ma in _context.MeetingAgendas.AsQueryable() on m.MeetingID equals ma.MeetingID
                        join mat in _context.MeetingAttendees.AsQueryable() on m.MeetingID equals mat.MeetingID
                        where (-1 == meetingOccuranceID || m.MeetingID == meetingOccuranceID)
                        select new MeetingDTO()
                        {
                            MeetingID = m.MeetingID,
                            MeetingOccuranceID = m.MeetingOccuranceID,
                            Occurance = mo.Name,
                            Title = m.Title,
                            Description = m.Description,
                            StartDate = f.StartDate,
                            EndDate = f.EndDate,
                            StartTime = f.StartTime, 
                            EndTime = f.EndTime,
                            Location =f.Location,
                            AgendaTitle = ma.Title,
                            AgendaAssigneeID = ma.AssigneeID,
                            AgendaComments = ma.Comments,
                            //AttendeeAssigneeID = mat.AttendeeID,
                        }).ToList();
            return data;
        }
    }
}
