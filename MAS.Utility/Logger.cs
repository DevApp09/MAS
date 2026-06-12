using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Utility
{
    public static class Logger
    {
        //private static readonly string[] _processName = { "w3wp.exe", "aspnet_wp.exe", "iisexpress" };
        private static string GetExceptionDetail(Exception ex, string information, bool isInnerException = false)
        {
            var strBuilder = new StringBuilder(500);
            Exception innerException = ex;

            do
            {

                if (!(isInnerException))
                {
                    strBuilder.AppendLine("Error Log");
                    strBuilder.Append("Time :");
                    strBuilder.AppendLine(DateTime.Now.ToShortTimeString());


                    if (!string.IsNullOrEmpty(information))
                    {
                        strBuilder.Append("Information :");
                        strBuilder.AppendLine(information);
                    }

                    isInnerException = true;
                }
                else
                {
                    strBuilder.Append("Inner Exception :");
                    strBuilder.AppendLine();
                }

                strBuilder.Append("Type :");
                strBuilder.AppendLine(innerException.GetType().ToString());
                strBuilder.Append("Message :");
                strBuilder.AppendLine(innerException.Message);

                if (innerException.Source != null)
                {
                    strBuilder.Append("Source :");
                    strBuilder.AppendLine(innerException.Source);
                }

                if (innerException.TargetSite != null)
                {
                    strBuilder.Append("Function :");
                    strBuilder.AppendLine(innerException.TargetSite.ToString());
                }

                if (!string.IsNullOrEmpty(innerException.StackTrace))
                {
                    strBuilder.Append("Stack :");
                    strBuilder.AppendLine(innerException.StackTrace);
                }

                foreach (DictionaryEntry dictionaryEntry in innerException.Data)
                {
                    strBuilder.Append(dictionaryEntry.Key.ToString());
                    strBuilder.Append(" :");
                    strBuilder.AppendLine(dictionaryEntry.Value.ToString());
                }

                innerException = innerException.InnerException;
            }
            while (innerException != null);

            strBuilder.AppendLine();

            return strBuilder.ToString();
        }

        public static void LogError(Exception ex, string information)
        {
            try
            {
                var path = ConfigurationManager.AppSettings["LoggerPath"];
                //if (!_processName.Contains(System.Diagnostics.Process.GetCurrentProcess().ProcessName))
                //{
                //    path = Path.Combine(Directory.GetCurrentDirectory(), "Logs");
                //}
                //else
                //{
                //    path = System.Web.HttpContext.Current.Server.MapPath("Logs");
                //}

                string exceptionDetail = GetExceptionDetail(ex, information, false);

                path = Path.Combine(path, DateTime.Now.ToString("yyyy-MM-dd") + ".txt");
                File.AppendAllText(path, exceptionDetail);
            }
            catch { }
        }

        public static void LogInformation(string information)
        {
            try
            {
                var path = ConfigurationManager.AppSettings["LoggerPath"];

                //if (!_processName.Contains( System.Diagnostics.Process.GetCurrentProcess().ProcessName))
                //{
                //    path = Path.Combine(Directory.GetCurrentDirectory(), "Logs");
                //}
                //else 
                //{
                //    path = System.Web.HttpContext.Current.Server.MapPath("Logs");
                //}

                if (!Directory.Exists(path))
                {
                    Directory.CreateDirectory(path);
                }

                path = Path.Combine(path, DateTime.Now.ToString("yyyy-MM-dd") + ".txt");
                string data = "Information log " + Environment.NewLine + "Time :"
                    + DateTime.Now.ToShortTimeString()
                    + Environment.NewLine
                    + "Information :"
                    + information;

                File.AppendAllText(path, data);

            }
            catch { }


        }
    }
}
