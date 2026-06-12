using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Utility
{
    public static class JSONSerializer
    {
        public static string ToJson(DataSet dataset)
        {
            StringBuilder strBuilder = new StringBuilder();
            strBuilder.Append("{\"");
            strBuilder.Append(dataset.DataSetName);
            strBuilder.Append("\":");
            if (dataset.Tables.Count == 0)
            {
                strBuilder.Append("null");
            }
            else
            {
                strBuilder.Append("{");
                for (var i = 0; i < dataset.Tables.Count; i++)
                {
                    strBuilder.Append("\"");
                    strBuilder.Append(dataset.Tables[i].TableName);
                    strBuilder.Append("\":");
                    ToJson(dataset.Tables[i], ref strBuilder);
                    strBuilder.Append(",");
                }
                strBuilder.Remove(strBuilder.Length - 1, 1);
                strBuilder.Append("}");
            }
            strBuilder.Append("}");
            return strBuilder.ToString();
        }

        private static StringBuilder ToJson(DataTable dataTable, ref StringBuilder strBuilder)
        {
            //var jsSerialization = new JsonConvert

            if (strBuilder == null)
            {
                strBuilder = new StringBuilder();
            }

            if (dataTable.Rows.Count == 0)
            {
                strBuilder.Append("[]");
                return strBuilder;
            }

            strBuilder.Append("[");

            for (var i = 0; i < dataTable.Rows.Count; i++)
            {
                strBuilder.Append("{");

                object[] itemArray = dataTable.Rows[i].ItemArray;
                for (var j = 0; j < itemArray.Length; j++)
                {
                    var type = dataTable.Columns[j].DataType;
                    var name = dataTable.Columns[j].ColumnName;

                    strBuilder.Append("\"");
                    strBuilder.Append(name);
                    strBuilder.Append("\":");

                    if (Convert.IsDBNull(itemArray[j]))
                    {
                        strBuilder.Append("null");
                    }
                    else if (type == typeof(string))
                    {
                        strBuilder.Append(JsonConvert.SerializeObject(itemArray[j]));
                    }
                    else if (type == typeof(DateTime))
                    {
                        strBuilder.Append(JsonConvert.SerializeObject(itemArray[j].ToString()));
                    }
                    else if (type == typeof(TimeSpan))
                    {
                        strBuilder.Append(JsonConvert.SerializeObject(itemArray[j]));
                    }
                    else if (type == typeof(bool))
                    {
                        strBuilder.Append(itemArray[j].ToString().ToLower());
                    }
                    else
                    {
                        strBuilder.Append(JsonConvert.SerializeObject(itemArray[j]));
                    }
                    strBuilder.Append(",");
                }

                strBuilder.Remove(strBuilder.Length - 1, 1);
                strBuilder.Append("},");
            }

            strBuilder.Remove(strBuilder.Length - 1, 1);
            strBuilder.Append("]");

            return strBuilder;
        }

        public static string ToJson(DataTable dataTable)
        {
            StringBuilder strBuilder = null;
            return ToJson(dataTable, ref strBuilder).ToString();
        }
    }
}
