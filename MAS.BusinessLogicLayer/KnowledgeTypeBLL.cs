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
    public class KnowledgeTypeBLL : CrossThreadAccessCheck, IKnowledgeTypeBLL
    {
        private IUnitOfWork _unitOfWork;

        public KnowledgeTypeBLL() : this(IOC.Resolve<IUnitOfWork>())
        {

        }

        private KnowledgeTypeBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<KnowledgeTypeDTO> GetAll()
        {
            var entities = _unitOfWork.KnowledgeTypeRepository.GetAll(null);
            return entities;
        }

        public async Task<IEnumerable<KnowledgeTypeDTO>> GetAllAsync()
        {
            return await Task.Run(() => { return GetAll(); });
        }
        public IEnumerable<KeyValuePair<int, string>> GetAllKeyValuePair(bool? isActive, int? defaultKey, string defaultValue)
        {
            var inEntities = _unitOfWork.KnowledgeTypeRepository.GetAll(isActive)
                .Select(g => new KeyValuePair<int, string>(g.KnowledgeTypeID, g.Name))
                .ToList();

            if (null != defaultKey)
            {
                inEntities.Add(new KeyValuePair<int, string>(defaultKey.Value, defaultValue));
            }

            return inEntities;
        }

        public async Task<IEnumerable<KeyValuePair<int, string>>> GetAllKeyValuePairAsync(bool? isActive, int? defaultKey, string defaultValue)
        {
            return await Task.Run(() => { return GetAllKeyValuePair(isActive, defaultKey, defaultValue); });
        }
    }
}
