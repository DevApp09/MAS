//using AutoMapper;
using MAS.EntityFramework;
using MAS.Exceptions;
using MAS.InversionOfControl;
using MAS.BusinessLogicLayer.Contract;
using MAS.DataAccessLayer;
using MAS.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MAS.DataAccessLayer.UnitOfWork;

namespace MAS.BusinessLogicLayer
{
    public class QuestionOptionBLL : CrossThreadAccessCheck, IQuestionOptionBLL
    {
        private IUnitOfWork _unitOfWork;

        public QuestionOptionBLL() : this(IOC.Resolve<IUnitOfWork>())
        {

        }

        private QuestionOptionBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<QuestionOptionDTO> GetAll()
        {
            var entities = _unitOfWork.QuestionOptionRepository.GetAll(null, -1);
            return entities;
        }

        public async Task<IEnumerable<QuestionOptionDTO>> GetAllAsync()
        {
            return await Task.Run(() => { return GetAll(); });
        }

        public IEnumerable<KeyValuePair<long, string>> GetAllKeyValuePair(bool? isActive, long? defaultKey, string defaultValue, long questionID)
        {
            var inEntities = _unitOfWork.QuestionOptionRepository.GetAll(isActive, questionID)
                .Select(g => new KeyValuePair<long, string>(g.QuestionOptionID, g.Option))
                .ToList();

            if (null != defaultKey)
            {
                inEntities.Add(new KeyValuePair<long, string>(defaultKey.Value, defaultValue));
            }

            return inEntities;
        }

        public async Task<IEnumerable<KeyValuePair<long, string>>> GetAllKeyValuePairAsync(bool? isActive, long? defaultKey, string defaultValue, long questionID)
        {
            return await Task.Run(() => { return GetAllKeyValuePair(isActive, defaultKey, defaultValue, questionID); });
        }
    }
}
