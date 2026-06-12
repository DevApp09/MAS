using AutoMapper;
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
    public class KnowledgeBLL : CrossThreadAccessCheck, IKnowledgeBLL
    {
        private IUnitOfWork _unitOfWork;

        public KnowledgeBLL() : this(IOC.Resolve<IUnitOfWork>())
        {

        }
        private KnowledgeBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<KnowledgeDTO> GetAll(int questionTypeID)
        {
            var entities = _unitOfWork.KnowledgeRepository.GetAll(questionTypeID);
            return entities;
        }
        public async Task<IEnumerable<KnowledgeDTO>> GetAllAsync(int questionTypeID)
        {
            return await Task.Run(() => { return GetAll(questionTypeID); });
        }

        public long InsertOrUpdate(KnowledgeDTO entity)
        {
            //var knowledgeEntity = _unitOfWork.KnowledgeRepository.
            //    Get(x => !(x.KnowledgeID.Equals(entity.KnowledgeID))
            //    );

            if (entity.KnowledgeID <= 0)
            {
                Knowledge newEntity = new Knowledge();
                newEntity.KnowledgeTypeID = entity.KnowledgeTypeID;
                newEntity.Date = entity.Date;
                newEntity.Title = entity.Title;
                newEntity.Description = entity.Description;
                newEntity.FileName = entity.FileName;
                newEntity.InternalFileName = entity.InternalFileName;

                _unitOfWork.KnowledgeRepository.Insert(newEntity);
                _unitOfWork.Save();
                return newEntity.KnowledgeID;
            }
            else
            {
                var oldEntity = _unitOfWork.KnowledgeRepository.GetByID(entity.KnowledgeID);
                oldEntity.KnowledgeTypeID = entity.KnowledgeTypeID;
                oldEntity.Date = entity.Date;
                oldEntity.Title = entity.Title;
                oldEntity.Description = entity.Description;
                oldEntity.FileName = entity.FileName;
                oldEntity.InternalFileName = entity.InternalFileName;

                _unitOfWork.Save();
                return entity.KnowledgeID;
            }
        }
        public async Task<long> InsertOrUpdateAsync(KnowledgeDTO entity)
        {
            return await Task.Run(() => { return InsertOrUpdate(entity); });
        }

        public void Delete(long id)
        {
            try
            {
                CheckThreadSafetyAndAcquireIfNeeded();

                _unitOfWork.KnowledgeRepository.Delete(id);
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

        public KnowledgeDTO GetById(long id)
        {
            var knowledge = _unitOfWork.KnowledgeRepository.GetByID(id);
            var mapper = IOC.Resolve<IMapper>();
            return mapper.Map<Knowledge, KnowledgeDTO>(knowledge);
        }

        public async Task<KnowledgeDTO> GetByIdAsync(long id)
        {
            return await Task.Run(() => { return GetById(id); });
        }

        //public KnowledgeDTO GetById(long id)
        //{
        //    var data = _unitOfWork.KnowledgeRepository.GetByID(id);

        //    return data;
        //}
        //public async Task<KnowledgeDTO> GetByIdAsync(long id)
        //{
        //    return await Task.Run(() => { return GetById(id); });
        //}
    }
}
