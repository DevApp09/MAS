using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Exceptions
{
    public class BLLException : System.Exception
    {
        public BLLException(string message) : base(message) { }
    }
}
