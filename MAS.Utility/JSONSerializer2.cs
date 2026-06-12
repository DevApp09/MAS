using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Utility
{
    public class JSONSerializer2 : IJSONSerializer
    {
        public string ToJson(DataTable dataTable)
        {
            return JSONSerializer.ToJson(dataTable);
        }

        public string ToJson(DataSet dataset)
        {
            return JSONSerializer.ToJson(dataset);
        }
    }
}
