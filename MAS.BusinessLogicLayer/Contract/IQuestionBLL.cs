using MAS.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer.Contract
{
    public interface IQuestionBLL
    {
        IEnumerable<QuestionDTO> GetAll(int categoryID, int questionTypeID);
        Task<IEnumerable<QuestionDTO>> GetAllAsync(int categoryID, int questionTypeID);

        IEnumerable<KeyValuePair<long, string>> GetAllKeyValuePair(bool? isActive, long? defaultKey, string defaultValue);
        Task<IEnumerable<KeyValuePair<long, string>>> GetAllKeyValuePairAsync(bool? isActive, long? defaultKey, string defaultValue);
        
        long InsertOrUpdate(QuestionDTO entity);
        Task<long> InsertOrUpdateAsync(QuestionDTO entity);
        
        void Delete(long questionID);
        Task DeleteAsync(long questionID);

        QuestionDTO GetById(long questionID);
        Task<QuestionDTO> GetByIdAsync(long questionID);

        IEnumerable<QuestionDTO> GetAll(bool? isActive);
        Task<IEnumerable<QuestionDTO>> GetAllAsync(bool? isActive);
    }
}
