using MAS.Authentications;
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
using System.Transactions;

namespace MAS.BusinessLogicLayer
{
    public class SurveyAssignmentBLL : CrossThreadAccessCheck, ISurveyAssignmentBLL
    {
        private IUnitOfWork _unitOfWork;
        private readonly IUserInfo _userInfo;

        public SurveyAssignmentBLL() : this(IOC.Resolve<IUnitOfWork>(), IOC.Resolve<IUserInfo>())
        {

        }
        private SurveyAssignmentBLL(IUnitOfWork unitOfWork, IUserInfo userInfo)
        {
            _unitOfWork = unitOfWork;
            _userInfo = userInfo;
        }

        public IEnumerable<SurveyAssignmentDTO> GetAll()
        {
            var entities = _unitOfWork.SurveyAssignmentRepository.GetAll();
            return entities;
        }
        public async Task<IEnumerable<SurveyAssignmentDTO>> GetAllAsync()
        {
            return await Task.Run(() => { return GetAll(); });
        }

        public long InsertOrUpdate(SurveyAssignmentDTO entity)
        {
            //var isExists = _unitOfWork.SurveyAssignmentRepository.IsExists(entity.SurveyAssignmentID, entity.SurveyID, entity.StartDate, entity.EndDate);

            //if (isExists)
            //    throw new BLLException("System was unable to add/update survey because it is overlapped with other records.");

            using (TransactionScope transactionScope = new TransactionScope())
            {
                var surveyAssignmentDone = _unitOfWork.SurveyAssigneeRepository.GetMany((sa) => sa.SurveyID == entity.SurveyID);

                var managerAddRequired = (from e in entity.ManagerID
                                          let temp = (from sa in surveyAssignmentDone
                                                      where sa.RoleID == 3
                                                      select sa.AssigneeID)
                                          where !temp.Contains(e)
                                          select e).ToArray();

                var assignedAddRequired = (from e in entity.AssigneeID
                                           let temp = (from sa in surveyAssignmentDone
                                                       where sa.RoleID == 1
                                                       select sa.AssigneeID)
                                           where !temp.Contains(e)
                                           select e).ToArray();

                var managerDeleteRequired = (from sa in surveyAssignmentDone
                                             where sa.RoleID == 3 && !entity.ManagerID.Contains(sa.AssigneeID)
                                             select sa.AssigneeID).ToArray();

                var assigneeDeleteRequired = (from sa in surveyAssignmentDone
                                              where sa.RoleID == 1 && !entity.AssigneeID.Contains(sa.AssigneeID)
                                              select sa.AssigneeID).ToArray();

                foreach (var item in managerAddRequired)
                {
                    SurveyAssignee sa = new SurveyAssignee();
                    sa.SurveyID = entity.SurveyID;
                    sa.AssigneeID = item;
                    sa.RoleID = 3;
                    sa.IsOptional = false;
                    sa.IsSubmitted = false;
                    _unitOfWork.SurveyAssigneeRepository.Insert(sa);
                }

                foreach (var item in assignedAddRequired)
                {
                    SurveyAssignee sa = new SurveyAssignee();
                    sa.SurveyID = entity.SurveyID;
                    sa.AssigneeID = item;
                    sa.RoleID = 1;
                    sa.IsOptional = false;
                    sa.IsSubmitted = false;
                    _unitOfWork.SurveyAssigneeRepository.Insert(sa);
                }

                foreach (var item in managerDeleteRequired)
                {
                    _unitOfWork.SurveyAssigneeRepository.Delete(surveyAssignmentDone.Where(sa => sa.AssigneeID == item).FirstOrDefault());
                }

                foreach (var item in assigneeDeleteRequired)
                {
                    _unitOfWork.SurveyAssigneeRepository.Delete(surveyAssignmentDone.Where(sa => sa.AssigneeID == item).FirstOrDefault());
                }



                _unitOfWork.Save();
                transactionScope.Complete();
                return -1;
            }
        }
        public async Task<long> InsertOrUpdateAsync(SurveyAssignmentDTO entity)
        {
            return await Task.Run(() => { return InsertOrUpdate(entity); });
        }

        public void Delete(long surveyAssignmentId)
        {
            try
            {
                CheckThreadSafetyAndAcquireIfNeeded();

                _unitOfWork.SurveyAssignmentRepository.Delete(surveyAssignmentId);
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
        public async Task DeleteAsync(long surveyAssignmentId)
        {
            await Task.Run(() => { Delete(surveyAssignmentId); });
        }

        public SurveyAssignmentDTO GetById(long surveyAssignmentId)
        {
            var entities = _unitOfWork.SurveyAssignmentRepository.GetById(surveyAssignmentId);
            return entities;
        }
        public async Task<SurveyAssignmentDTO> GetByIdAsync(long surveyAssignmentId)
        {
            return await Task.Run(() => { return GetById(surveyAssignmentId); });
        }

        public IEnumerable<SurveyAssignmentDTO> GetAllSubmit(long surveyId)
        {
            var entities = _unitOfWork.SurveyAssignmentRepository.GetAllSubmit(surveyId);
            return entities;
        }
        public async Task<IEnumerable<SurveyAssignmentDTO>> GetAllSubmitAsync(long surveyId)
        {
            return await Task.Run(() => { return GetAllSubmit(surveyId); });
        }

        public SurveySubmitDTO GetSubmitById(long surveyAssigneeId)
        {
            var entities = _unitOfWork.SurveyAssignmentRepository.GetSubmitById(surveyAssigneeId);
            return entities;
        }
        public async Task<SurveySubmitDTO> GetSubmitByIdAsync(long surveyAssigneeId)
        {
            return await Task.Run(() => { return GetSubmitById(surveyAssigneeId); });
        }

        public void SubmitDelete(long surveyAssigneeId)
        {
            try
            {
                CheckThreadSafetyAndAcquireIfNeeded();
                _unitOfWork.SurveySubmissionRepository.Delete(x => x.SurveyAssigneeID == surveyAssigneeId);
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
        public async Task SubmitDeleteAsync(long surveyAssigneeId)
        {
            await Task.Run(() => { SubmitDelete(surveyAssigneeId); });
        }

        public SurveyDeploymentInitDataDTO GetSurveyDeploymentInitDataDTO(long surveyId)
        {
            var surveyAssignment = _unitOfWork.SurveyAssigneeRepository.GetMany(sa => sa.SurveyID == surveyId);
            SurveyDeploymentInitDataDTO entity = new SurveyDeploymentInitDataDTO();
            entity.Assignees = (from sa in surveyAssignment
                                where sa.RoleID == 1
                                select sa.AssigneeID).ToArray();
            entity.Managers = (from sa in surveyAssignment
                               where sa.RoleID == 3
                               select sa.AssigneeID).ToArray();
            return entity;
        }

        public async Task<SurveyDeploymentInitDataDTO> GetSurveyDeploymentInitDataDTOAsync(long surveyId)
        {
            return await Task.Run(() => { return GetSurveyDeploymentInitDataDTO(surveyId); });
        }

        public IEnumerable<SurveyAssignmentDTO> GetDeployAssignees(long surveyId)
        {
            return _unitOfWork.SurveyAssignmentRepository.GetDeployAssignees(surveyId);
        }
        public async Task<IEnumerable<SurveyAssignmentDTO>> GetDeployAssigneesAsync(long surveyId)
        {
            return await Task.Run(() => { return GetDeployAssignees(surveyId); });
        }

        public long SaveSingleAssignee(long surveyId, int userId, int roleId)
        {
            //var exists = _unitOfWork.SurveyAssigneeRepository.GetMany(x => x.SurveyID == surveyId && x.AssigneeID == userId && x.RoleID == roleId).Any();
            //if (exists)
            //{
            //    throw new BLLException("This user is already assigned to this role for this survey.");
            //}

            SurveyAssignee sa = new SurveyAssignee();
            sa.SurveyID = surveyId;
            sa.AssigneeID = userId;
            sa.RoleID = roleId;
            sa.IsOptional = false;
            sa.IsSubmitted = false;

            _unitOfWork.SurveyAssigneeRepository.Insert(sa);
            _unitOfWork.Save();

            return sa.SurveyAssigneeID;
        }
        public async Task<long> SaveSingleAssigneeAsync(long surveyId, int userId, int roleId)
        {
            return await Task.Run(() => { return SaveSingleAssignee(surveyId, userId, roleId); });
        }

        public void DeleteSingleAssignee(long surveyAssigneeId)
        {
            var isExists = _unitOfWork.SurveySubmissionRepository.IsExists(surveyAssigneeId);
            if (isExists)
                throw new BLLException("System was unable to delete survey assignee because survey is submitted by user.");

            _unitOfWork.SurveyAssigneeRepository.Delete(surveyAssigneeId);
            _unitOfWork.Save();
        }
        public async Task DeleteSingleAssigneeAsync(long surveyAssigneeId)
        {
            await Task.Run(() => { DeleteSingleAssignee(surveyAssigneeId); });
        }
    }
}
