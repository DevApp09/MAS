using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Utility
{
    public interface IJSONSerializer
    {
        string ToJson(DataSet dataset);

        string ToJson(DataTable dataTable);
    }
}
