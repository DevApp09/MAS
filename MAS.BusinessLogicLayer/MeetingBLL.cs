using MAS.BusinessLogicLayer.Contract;
using MAS.DataAccessLayer.UnitOfWork;
using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.Exceptions;
using MAS.InversionOfControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer
{
    public class MeetingBLL : CrossThreadAccessCheck, IMeetingBLL
    {
        private IUnitOfWork _unitOfWork;

        public MeetingBLL() : this(IOC.Resolve<IUnitOfWork>())
        {

        }
        private MeetingBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<MeetingDTO> GetAll(int questionTypeID)
        {
            var entities = _unitOfWork.MeetingRepository.GetAll(questionTypeID);
            return entities;
        }
        public async Task<IEnumerable<MeetingDTO>> GetAllAsync(int questionTypeID)
        {
            return await Task.Run(() => { return GetAll(questionTypeID); });
        }

        public long InsertOrUpdate(MeetingDTO entity)
        {
            if (entity.MeetingID <= 0)
            {
                Meeting newEntity = new Meeting();
                newEntity.MeetingOccuranceID = entity.MeetingOccuranceID;
                newEntity.Title = entity.Title;
                newEntity.Description = entity.Description;
                _unitOfWork.MeetingRepository.Insert(newEntity);

                MeetingFollowup mf = new MeetingFollowup();
                newEntity.MeetingID = mf.MeetingID;
                mf.StartDate = entity.StartDate;
                mf.EndDate = entity.EndDate;
                mf.StartTime = entity.StartTime;
                mf.EndTime = entity.EndTime;
                mf.Location = entity.Location;
                _unitOfWork.MeetingFollowupRepository.Insert(mf);

                MeetingAgenda meetingAgenda = new MeetingAgenda();
                meetingAgenda.MeetingID = entity.MeetingID;
                meetingAgenda.Title = entity.AgendaTitle;
                meetingAgenda.AssigneeID = entity.AgendaAssigneeID;
                meetingAgenda.Comments = entity.AgendaComments;
                _unitOfWork.MeetingAgendaRepository.Insert(meetingAgenda);

                for (int i = 0; i < entity.AttendeeAssigneeID.Length; i++)
                {
                    {
                        MeetingAttendee meetingAttendee = new MeetingAttendee();
                        meetingAttendee.MeetingID = entity.MeetingID;
                        meetingAttendee.AttendeeID = entity.AttendeeAssigneeID[i];
                        _unitOfWork.MeetingAttendeeRepository.Insert(meetingAttendee);
                    }
                }
                _unitOfWork.Save();
                return newEntity.MeetingID;
            }
            else
            {
                var oldEntity = _unitOfWork.MeetingRepository.GetByID(entity.MeetingID);
                var oldEntity2 = _unitOfWork.MeetingFollowupRepository.GetByID(entity.MeetingID);
                var oldEntity3 = _unitOfWork.MeetingAgendaRepository.GetByID(entity.MeetingID);
                var oldEntity4 = _unitOfWork.MeetingAttendeeRepository.GetByID(entity.MeetingID);
                oldEntity.MeetingOccuranceID = entity.MeetingOccuranceID;
                oldEntity.Title = entity.Title;
                oldEntity.Description = entity.Description;
                oldEntity2.StartDate = entity.StartDate;
                oldEntity2.EndDate = entity.EndDate;
                oldEntity2.StartTime = entity.StartTime;
                oldEntity2.EndTime = entity.EndTime;
                oldEntity2.Location = entity.Location;
                //oldEntity3.Title = entity.AgendaTitle;
                //oldEntity3.AssigneeID = entity.AgendaAssigneeID;
                //oldEntity3.Comments = entity.AgendaComments;

                for (int i = 0; i < entity.AttendeeAssigneeID.Length; i++)
                {
                    {
                        MeetingAttendee meetingAttendee = new MeetingAttendee();
                        meetingAttendee.MeetingID = entity.MeetingID;
                        meetingAttendee.AttendeeID = entity.AttendeeAssigneeID[i];
                    }
                }

                _unitOfWork.Save();
                return entity.MeetingID;
            }
        }
        public async Task<long> InsertOrUpdateAsync(MeetingDTO entity)
        {
            return await Task.Run(() => { return InsertOrUpdate(entity); });
        }

        public void Delete(long id)
        {
            try
            {
                CheckThreadSafetyAndAcquireIfNeeded();

                _unitOfWork.MeetingRepository.Delete(id);
                try
                {
                    _unitOfWork.Save();
                }
                catch
                {
                    throw new BLLException("Being used somewhere else.");
                }
            }
            finally
            {
                ReleaseLock();
            }
        }
        public async Task DeleteAsync(long id)
        {
            await Task.Run(() => { Delete(id); });
        }
    }
}
