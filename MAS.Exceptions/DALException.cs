using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Exceptions
{
    public class DALException : System.Exception
    {
        public DALException(string message) : base(message) { }
    }
}
