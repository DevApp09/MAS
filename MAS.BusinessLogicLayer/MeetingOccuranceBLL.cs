using MAS.BusinessLogicLayer.Contract;
using MAS.DataAccessLayer.UnitOfWork;
using MAS.InversionOfControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer
{
    public class MeetingOccuranceBLL : CrossThreadAccessCheck, IMeetingOccuranceBLL
    {
        private IUnitOfWork _unitOfWork;

        public MeetingOccuranceBLL() : this(IOC.Resolve<IUnitOfWork>())
        {

        }

        private MeetingOccuranceBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<KeyValuePair<int, string>> GetAllKeyValuePair(bool? isActive, int? defaultKey, string defaultValue)
        {
            var inEntities = _unitOfWork.MeetingOccuranceRepository.GetAll2(isActive)
                .Select(g => new KeyValuePair<int, string>(g.MeetingOccuranceID, g.Name))
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
