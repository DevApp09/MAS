using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer.Contract
{
    public interface IMeetingOccuranceBLL
    {
        IEnumerable<KeyValuePair<int, string>> GetAllKeyValuePair(bool? isActive, int? defaultKey, string defaultValue);
        Task<IEnumerable<KeyValuePair<int, string>>> GetAllKeyValuePairAsync(bool? isActive, int? defaultKey, string defaultValue);
    }
}
