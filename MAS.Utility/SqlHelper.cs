using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Data.SqlClient;
using System.Data;
using System.Reflection;
using System.Configuration;

namespace MAS.Utility
{
    public static class SqlHelper
    {
        public static int RunQuery(string connectionString, string query, IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            try
            {
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, query, CommandType.Text, parameters);
                InitCode(ref param, ref connection, ref command);
                return command.ExecuteNonQuery();
            }
            finally
            {
                ReleaseObjects(ref connection, ref command);
            }
        }

        public static int RunQuery2(string connectionString, string query, IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            try
            {
                var executionTime = Convert.ToInt32(ConfigurationManager.AppSettings["ExecutionTimeOut"].ToString());
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, query, CommandType.Text, parameters, executionTime);
                InitCode(ref param, ref connection, ref command);
                return command.ExecuteNonQuery();
            }
            finally
            {
                ReleaseObjects(ref connection, ref command);
            }
        }

        public static object RunScalerQuery(string connectionString, string query, IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            try
            {
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, query, CommandType.Text, parameters);
                InitCode(ref param, ref connection, ref command);
                return command.ExecuteScalar();
            }
            finally
            {
                ReleaseObjects(ref connection, ref command);
            }
        }

        public static DataTable GetDataTable(string connectionString, string query, IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            SqlDataReader reader = null;
            try
            {
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, query, CommandType.Text, parameters);
                InitCode(ref param, ref connection, ref command);
                reader = command.ExecuteReader();
                var dataTable = new DataTable();
                dataTable.BeginLoadData();
                dataTable.Load(reader);
                dataTable.EndLoadData();
                return dataTable;
            }
            finally
            {
                ReleaseObjects(ref connection, ref command, ref reader);
            }
        }

        public static object ExecuteScalerSP(string connectionString, string SPName, IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            try
            {
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, SPName, CommandType.StoredProcedure, parameters);
                InitCode(ref param, ref connection, ref command);
                return command.ExecuteScalar();
            }
            finally
            {
                ReleaseObjects(ref connection, ref command);
            }
        }

        public static DataTable GetDataTableFromSP(string connectionString, string SPName, IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            SqlDataReader reader = null;

            try
            {
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, SPName, CommandType.StoredProcedure, parameters, 120);
                InitCode(ref param, ref connection, ref command);
                reader = command.ExecuteReader();

                var dataTable = new DataTable();
                dataTable.BeginLoadData();
                dataTable.Load(reader);
                dataTable.EndLoadData();
                return dataTable;
            }
            finally
            {
                ReleaseObjects(ref connection, ref command, ref reader);
            }
        }

        public static DataTable GetDataTableFromSP2(string connectionString, string SPName, IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            SqlDataReader reader = null;

            try
            {
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, SPName, CommandType.StoredProcedure, parameters, 300);
                InitCode(ref param, ref connection, ref command);
                reader = command.ExecuteReader();

                var dataTable = new DataTable();
                dataTable.BeginLoadData();
                dataTable.Load(reader);
                dataTable.EndLoadData();
                return dataTable;
            }
            finally
            {
                ReleaseObjects(ref connection, ref command, ref reader);
            }
        }

        public static DataSet GetDataSetFromSP(string connectionString, string SPName, IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            SqlDataAdapter adapter = null;
            try
            {
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, SPName, CommandType.StoredProcedure, parameters, 60);
                InitCode(ref param, ref connection, ref command);
                adapter = new SqlDataAdapter(command);
                var dataSet = new DataSet();
                adapter.Fill(dataSet);
                return dataSet;
            }
            finally
            {
                ReleaseObjects(ref connection, ref command, ref adapter);
            }
        }

        public static DataSet GetDataSet(string connectionString, string SPName, IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            SqlDataAdapter adapter = null;
            try
            {
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, SPName, CommandType.Text, parameters, 60);
                InitCode(ref param, ref connection, ref command);
                adapter = new SqlDataAdapter(command);
                var dataSet = new DataSet();
                adapter.Fill(dataSet);
                return dataSet;
            }
            finally
            {
                ReleaseObjects(ref connection, ref command, ref adapter);
            }
        }

        public static void ExecuteSP(string connectionString, string SPName, IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            try
            {
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, SPName, CommandType.StoredProcedure, parameters);
                InitCode(ref param, ref connection, ref command);
                command.ExecuteNonQuery();
            }
            finally
            {
                ReleaseObjects(ref connection, ref command);
            }
        }

        public static object Get(string connectionString, string query, Func<SqlDataReader, object> fillCallBack, CommandType commandType = CommandType.Text
            , IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            SqlDataReader reader = null;

            try
            {
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, query, commandType, parameters);
                InitCode(ref param, ref connection, ref command);

                reader = command.ExecuteReader();
                return fillCallBack(reader);
            }
            finally
            {
                ReleaseObjects(ref connection, ref command, ref reader);
            }
        }

        public static List<T> Get<T>(string connectionString, string query, CommandType commandType = CommandType.Text
            , IEnumerable<SqlParameter> parameters = null)
        {
            SqlConnection connection = null;
            SqlCommand command = null;
            SqlDataReader reader = null;
            try
            {
                InitCodeParam param = InitCodeParam.GetInstance(connectionString, query, commandType, parameters);
                InitCode(ref param, ref connection, ref command);
                reader = command.ExecuteReader();

                var list = new List<T>();
                PropertyInfo[] propertyInfo = typeof(T).GetProperties();

                while (reader.Read())
                {
                    var instance = Activator.CreateInstance<T>();

                    for (int i = 0; i < propertyInfo.Length; i++)
                    {
                        var property = propertyInfo[i];
                        var propertyName = property.Name;

                        object value = reader[propertyName];
                        if (!Convert.IsDBNull(value))
                        {
                            property.SetValue(instance, value, null);
                        }
                    }

                    list.Add(instance);
                }

                return list;
            }
            finally
            {
                ReleaseObjects(ref connection, ref command, ref reader);
            }
        }

        public static SqlParameter GetParam(string paramName, object paramValue, ParameterDirection direction, SqlDbType dbType)
        {
            SqlParameter param = new SqlParameter();
            param.ParameterName = paramName;
            if (paramValue != null)
                param.Value = paramValue;
            param.Direction = direction;
            param.SqlDbType = dbType;
            return param;
        }

        private static void InitCode(ref InitCodeParam initCodeParam, ref SqlConnection connection, ref SqlCommand command)
        {
            connection = new SqlConnection(initCodeParam.ConnectionString);
            connection.Open();
            command = new SqlCommand(initCodeParam.Query, connection);
            command.CommandType = initCodeParam.CommandType;
            command.CommandTimeout = initCodeParam.CommandTimeOut;
            if (null != initCodeParam.Parameters)
            {
                foreach (SqlParameter param in initCodeParam.Parameters)
                {
                    command.Parameters.Add(param);
                }
            }
        }

        private static void ReleaseObjects(ref SqlConnection connection, ref SqlCommand command, ref SqlDataReader reader)
        {
            if (null != reader)
            {
                reader.Dispose();
            }

            ReleaseObjects(ref connection, ref command);
        }

        private static void ReleaseObjects(ref SqlConnection connection, ref SqlCommand command, ref SqlDataAdapter adapter)
        {
            if (null != adapter)
            {
                adapter.Dispose();
            }

            ReleaseObjects(ref connection, ref command);
        }

        private static void ReleaseObjects(ref SqlConnection connection, ref SqlCommand command)
        {
            if (null != command)
            {
                command.Dispose();
            }

            if (null != connection)
            {
                connection.Dispose();
            }
        }
    }

    internal struct InitCodeParam
    {
        private string _connectionString;
        private string _query;
        private CommandType _commandType;
        private IEnumerable<SqlParameter> _parameters;
        private int _commandTimeOut;

        private InitCodeParam(string connectionString, string query, CommandType commandType, IEnumerable<SqlParameter> parameters)
        {
            _connectionString = connectionString;
            _query = query;
            _commandType = commandType;
            _parameters = parameters;
            _commandTimeOut = 60;
        }

        internal string ConnectionString { get { return _connectionString; } }
        internal string Query { get { return _query; } }
        internal CommandType CommandType { get { return _commandType; } }
        internal IEnumerable<SqlParameter> Parameters { get { return _parameters; } }
        internal int CommandTimeOut { get { return _commandTimeOut; } }

        internal static InitCodeParam GetInstance(string connectionString, string query, CommandType commandType, IEnumerable<SqlParameter> parameters, int commandTimeOut = 60)
        {
            InitCodeParam param = new InitCodeParam(connectionString, query, commandType, parameters);
            param._commandTimeOut = commandTimeOut;
            return param;
        }
    }
}
