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
    public class ConditionBLL : CrossThreadAccessCheck, IConditionBLL
    {
        private IUnitOfWork _unitOfWork;

        public ConditionBLL() : this(IOC.Resolve<IUnitOfWork>())
        {

        }

        private ConditionBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<ConditionDTO> GetAll()
        {
            var entities = _unitOfWork.ConditionRepository.GetAll(null);
            return entities;
        }
        public async Task<IEnumerable<ConditionDTO>> GetAllAsync()
        {
            return await Task.Run(() => { return GetAll(); });
        }
    }
}
