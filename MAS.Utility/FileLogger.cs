using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Utility
{
    public class FileLogger : ILogger
    {
        public void Error(string message, Exception ex)
        {
            Logger.LogError(ex, message);
        }

        public void Info(string message)
        {
            Logger.LogInformation(message);
        }
    }
}
