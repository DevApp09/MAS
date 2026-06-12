using MAS.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer.Contract
{
    public interface IMeetingBLL
    {
        IEnumerable<MeetingDTO> GetAll(int meetingOccuranceID);
        Task<IEnumerable<MeetingDTO>> GetAllAsync(int meetingOccuranceID);

        long InsertOrUpdate(MeetingDTO entity);
        Task<long> InsertOrUpdateAsync(MeetingDTO entity);

        void Delete(long id);
        Task DeleteAsync(long id);
    }
}
