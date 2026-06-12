using MAS.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer.Contract
{
    public interface IQuestionOptionBLL
    {
        IEnumerable<QuestionOptionDTO> GetAll();
        Task<IEnumerable<QuestionOptionDTO>> GetAllAsync();

        IEnumerable<KeyValuePair<long, string>> GetAllKeyValuePair(bool? isActive, long? defaultKey, string defaultValue, long questionID);
        Task<IEnumerable<KeyValuePair<long, string>>> GetAllKeyValuePairAsync(bool? isActive, long? defaultKey, string defaultValue, long questionID);
    }
}
