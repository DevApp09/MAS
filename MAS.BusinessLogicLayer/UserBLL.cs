using MAS.BusinessLogicLayer.Contract;
using MAS.DataAccessLayer.UnitOfWork;
using MAS.DataTransferObject;
using MAS.InversionOfControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer
{
    public class UserBLL : CrossThreadAccessCheck, IUserBLL
    {
        private IUnitOfWork _unitOfWork;

        public UserBLL() : this(IOC.Resolve<IUnitOfWork>())
        {

        }

        private UserBLL(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        public IEnumerable<KeyValuePair<int, string>> GetAllKeyValuePair(int? defaultKey, string defaultValue)
        {
            var inEntities = _unitOfWork.UserRepository.GetAll()
                .Select(g => new KeyValuePair<int, string>(g.UserID, g.Name))
                .ToList();

            if (null != defaultKey)
            {
                inEntities.Add(new KeyValuePair<int, string>(defaultKey.Value, defaultValue));
            }

            return inEntities;
        }

        public async Task<IEnumerable<KeyValuePair<int, string>>> GetAllKeyValuePairAsync(int? defaultKey, string defaultValue)
        {
            return await Task.Run(() => { return GetAllKeyValuePair(defaultKey, defaultValue); });
        }

        public IEnumerable<UserDTO2> GetAllUsers()
        {
            var inEntities = _unitOfWork.UserRepository.GetAll2()
                .ToList();

            return inEntities;
        }

        public async Task<IEnumerable<UserDTO2>> GetAllUsersAsync()
        {
            return await Task.Run(() => { return GetAllUsers(); });
        }

        public UserInformationDTO IsValid(string login, string password)
        {
            return _unitOfWork.UserRepository.GetValidUser(login, password);
        }
        public async Task<UserInformationDTO> IsValidAsync(string login, string password)
        {
            return await Task.Run(() => { return IsValid(login, password); });
        }
    }
}
