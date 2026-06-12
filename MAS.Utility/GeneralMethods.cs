using System.Linq;
using System.Text;
using System.Web;
using System.Dynamic;
using System.Data;
////using System.Net.Http;
//using System.ServiceModel.Channels;
using System.Reflection;
//using iTextSharp;
//using iTextSharp.text;
//using iTextSharp.text.pdf;
using System.IO;
using System.ComponentModel;
//using OfficeOpenXml;
using System.Net.Mail;
using System;
using System.Collections.Generic;

namespace MAS.Utility
{
    public static class GeneralMethods
    {
        public static string GetCurrentIP()
        {
            if (HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"] != null)
            {
                return HttpContext.Current.Request.ServerVariables["HTTP_X_FORWARDED_FOR"].ToString();
            }
            else
            {
                return HttpContext.Current.Request.UserHostAddress;
            }
        }

        public static string ConvertNumberToWords(int number)
        {
            if (number == 0)
                return "Zero";

            if (number < 0)
                return "Minus " + ConvertNumberToWords(Math.Abs(number));

            string words = "";

            if ((number / 1000000) > 0)
            {
                words += ConvertNumberToWords(number / 1000000) + " Million ";
                number %= 1000000;
            }

            if ((number / 1000) > 0)
            {
                words += ConvertNumberToWords(number / 1000) + " Thousand ";
                number %= 1000;
            }

            if ((number / 100) > 0)
            {
                words += ConvertNumberToWords(number / 100) + " Hundred ";
                number %= 100;
            }

            if (number > 0)
            {
                if (words != "")
                    words += "And ";

                var unitsMap = new[] { "Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen" };
                var tensMap = new[] { "Zero", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety" };

                if (number < 20)
                    words += unitsMap[number];
                else
                {
                    words += tensMap[number / 10];
                    if ((number % 10) > 0)
                        words += "-" + unitsMap[number % 10];
                }
            }

            return words;
        }

        /// <summary>
        /// Check for null,DBNull,Empty string and whitespace
        /// </summary>
        /// <param name="value"></param>
        /// <returns></returns>
        public static bool IsDbNullOrNullOrEmptyOrWhitespaceValue(object value)
        {
            if (value == null)
                return true;
            else if (string.IsNullOrEmpty(value.ToString()))
                return true;
            else if (string.IsNullOrWhiteSpace(value.ToString()))
                return true;
            else if (Convert.IsDBNull(value))
                return true;
            else
                return false;
        }

        public static T DefaultIfDbNullOrNullOrEmptyOrWhitespaceValue<T>(T value1, T value2)
        {
            if (IsDbNullOrNullOrEmptyOrWhitespaceValue(value1))
            {
                return value2;
            }
            else
            {
                return value1;
            }
        }

        public static int ForcefullyToInt(this string instance)
        {
            if (!IsDbNullOrNullOrEmptyOrWhitespaceValue(instance))
            {
                return Convert.ToInt32(instance);
            }
            else
            {
                return 0;
            }
        }

        public static IEnumerable<dynamic> AsDynamicEnumerable(this DataTable table)
        {
            // Validate argument here..

            return table.AsEnumerable().Select(row => new DynamicRow(row));
        }

        public static DataTable ToDataTable<T>(this IEnumerable<T> collection)
        {
            //DataTable dt = new DataTable();
            //Type t = typeof(T);
            //PropertyInfo[] pia = t.GetProperties();
            //foreach (PropertyInfo pi in pia)
            //{
            //    dt.Columns.Add(pi.Name, pi.PropertyType);
            //}

            //foreach (T item in collection)
            //{
            //    DataRow dr = dt.NewRow();
            //    dr.BeginEdit();
            //    foreach (PropertyInfo pi in pia)
            //    {
            //        dr[pi.Name] = pi.GetValue(item, null);
            //    }
            //    dr.EndEdit();
            //    dt.Rows.Add(dr);
            //}
            //return dt;
            PropertyDescriptorCollection properties =
            TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            foreach (PropertyDescriptor prop in properties)
                table.Columns.Add(prop.Name, Nullable.GetUnderlyingType(prop.PropertyType) ?? prop.PropertyType);
            foreach (T item in collection)
            {
                DataRow row = table.NewRow();
                foreach (PropertyDescriptor prop in properties)
                    row[prop.Name] = prop.GetValue(item) ?? DBNull.Value;
                table.Rows.Add(row);
            }
            return table;
        }

        //public static string CombineMultiplePDFs(IEnumerable<string> fileNames)
        //{
        //    string outFile = Path.GetTempFileName();
        //    Document document = new Document();
        //    PdfCopy writer = new PdfCopy(document, new FileStream(outFile, FileMode.Create));

        //    writer.SetMergeFields();
        //    document.Open();

        //    foreach (string fileName in fileNames)
        //    {
        //        PdfReader reader = new PdfReader(fileName);
        //        writer.AddDocument(reader);
        //    }
        //    writer.Close();
        //    document.Close();
        //    var ext = Path.GetExtension(outFile);
        //    var outFile2 = outFile.Replace(ext, ".pdf");
        //    File.Move(outFile, outFile2);
        //    return outFile2;
        //}

        public static List<T> ToList<T>(this DataTable table) where T : class, new()
        {
            List<T> list = new List<T>();

            foreach (var row in table.AsEnumerable())
            {
                T obj = new T();

                foreach (var prop in obj.GetType().GetProperties())
                {
                    try
                    {
                        PropertyInfo propertyInfo = obj.GetType().GetProperty(prop.Name);
                        propertyInfo.SetValue(obj, Convert.ChangeType(row[prop.Name], propertyInfo.PropertyType), null);
                    }
                    catch
                    {
                        continue;
                    }
                }

                list.Add(obj);
            }

            return list;
        }

        //public static List<T> GetAllFromExcel<T>(string path) where T : class, new()
        //{
        //    var datatable = GetDataTableFromExcel(path);
        //    return datatable.ToList<T>();
        //}

        //public static DataTable GetDataTableFromExcel(string path)
        //{
        //    using (var pck = new OfficeOpenXml.ExcelPackage())
        //    {
        //        using (FileStream stream = File.OpenRead(path))
        //        {
        //            pck.Load(stream);
        //        }

        //        var ws = pck.Workbook.Worksheets.First();
        //        DataTable tbl = new DataTable();
        //        bool hasHeader = true; // adjust it accordingly( i've mentioned that this is a simple approach)
        //        foreach (var firstRowCell in ws.Cells[1, 1, 1, ws.Dimension.End.Column])
        //        {
        //            tbl.Columns.Add(hasHeader ? firstRowCell.Text : string.Format("Column {0}", firstRowCell.Start.Column));
        //        }
        //        var startRow = hasHeader ? 2 : 1;
        //        for (var rowNum = startRow; rowNum <= ws.Dimension.End.Row; rowNum++)
        //        {
        //            var wsRow = ws.Cells[rowNum, 1, rowNum, ws.Dimension.End.Column];
        //            var row = tbl.NewRow();
        //            foreach (var cell in wsRow)
        //            {
        //                row[cell.Start.Column - 1] = cell.Value;
        //            }
        //            tbl.Rows.Add(row);
        //        }
        //        return tbl;
        //    }
        //}

        public static void SendEmail(string mailingAccountPassword, string from, string to, int port, string host, string subject, string body, IEnumerable<string> attachmentFilesPath, bool isBodyHtml = false)
        {
            MailMessage mail = new MailMessage(from, to);
            SmtpClient client = new SmtpClient();
            client.Port = port;
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.UseDefaultCredentials = false;
            client.Host = host;
            mail.Subject = subject;
            mail.Body = body;
            mail.IsBodyHtml = isBodyHtml;
            client.EnableSsl = true;
            client.Credentials = new System.Net.NetworkCredential(from, mailingAccountPassword);
            if (attachmentFilesPath != null && attachmentFilesPath.Count() > 0)
            {
                foreach (var filePath in attachmentFilesPath)
                {
                    mail.Attachments.Add(new Attachment(filePath));
                }
            }
            client.Send(mail);
        }

        public static KeyValuePair<DayOfWeek, int>[] GetOccurrenceOfDays(DateTime dateFrom, DateTime dateTo, DayOfWeek[] days)
        {
            TimeSpan ts = dateTo - dateFrom;
            int limit = ts.Days;
            return Enumerable.Range(0, limit + 1)
                .Select(x => dateFrom.AddDays(x))
                .GroupBy(x => x.DayOfWeek)
                .Select(x => new KeyValuePair<DayOfWeek, int>(x.Key, x.Count()))
                .ToArray();
        }

    }

    public sealed class DynamicRow : DynamicObject
    {
        private readonly DataRow _row;

        public DynamicRow(DataRow row) { _row = row; }

        // Interprets a member-access as an indexer-access on the 
        // contained DataRow.
        public override bool TryGetMember(GetMemberBinder binder, out object result)
        {
            var retVal = _row.Table.Columns.Contains(binder.Name);
            result = retVal ? _row[binder.Name] : null;
            return retVal;
        }
    }
}
