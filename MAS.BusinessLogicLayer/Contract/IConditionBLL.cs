using MAS.DataTransferObject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer.Contract
{
    public interface IConditionBLL
    {
        IEnumerable<ConditionDTO> GetAll();
        Task<IEnumerable<ConditionDTO>> GetAllAsync();
    }
}
