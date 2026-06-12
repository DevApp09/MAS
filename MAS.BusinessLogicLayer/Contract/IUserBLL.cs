using MAS.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer.Contract
{
    public interface IUserBLL
    {
        IEnumerable<KeyValuePair<int, string>> GetAllKeyValuePair(int? defaultKey, string defaultValue);
        Task<IEnumerable<KeyValuePair<int, string>>> GetAllKeyValuePairAsync(int? defaultKey, string defaultValue);

        UserInformationDTO IsValid(string login, string password);
        Task<UserInformationDTO> IsValidAsync(string login, string password);

        IEnumerable<UserDTO2> GetAllUsers();
        Task<IEnumerable<UserDTO2>> GetAllUsersAsync();
    }
}
