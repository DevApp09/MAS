using MAS.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer.Contract
{
    public interface IKnowledgeBLL
    {
        IEnumerable<KnowledgeDTO> GetAll(int questionTypeID);
        Task<IEnumerable<KnowledgeDTO>> GetAllAsync(int questionTypeID);

        long InsertOrUpdate(KnowledgeDTO entity);
        Task<long> InsertOrUpdateAsync(KnowledgeDTO entity);

        void Delete(long id);
        Task DeleteAsync(long id);

        KnowledgeDTO GetById(long id);
        Task<KnowledgeDTO> GetByIdAsync(long id);
    }
}
