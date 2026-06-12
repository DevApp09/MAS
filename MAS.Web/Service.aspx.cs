using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using MAS.InversionOfControl;
using MAS.Exceptions;
using MAS.Utility;
using MAS.BusinessLogicLayer.Contract;
using System.Threading.Tasks;
using MAS.Web.App_Start;
using MAS.DataTransferObject;
using System.Web.Script.Serialization;
using System.Reflection;
using System.IO;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using MAS.BusinessLogicLayer;
//using MAS.Web.App_Code;
using System.Runtime.Remoting.Messaging;
using System.Configuration;
using MAS.Authentications;
using MAS.Authentications;
using MAS.InversionOfControl;
using MAS.Utility;

namespace MAS.Web
{
    public partial class Service : System.Web.UI.Page
    {
        private ILogger _logger;
        private JavaScriptSerializer _serializer;
        private static readonly Dictionary<string, Tuple<string, string>> _serviceMethodInfo;
        private static readonly Type _serviceType;
        private string _postedJson;
        private IUserInfo _userInfo;

        static Service()
        {
            _serviceType = typeof(Service);
            _serviceMethodInfo = (from m in _serviceType.GetMethods(BindingFlags.Instance | BindingFlags.NonPublic | BindingFlags.Public)
                                  where m.GetCustomAttributes(typeof(RequestDirectTo), true).Length > 0
                                  select new Tuple<string, string>(m.Name, m.GetCustomAttribute<RequestDirectTo>().Keyword.Trim().ToLower()))
                                  .ToDictionary(x => x.Item2);
        }

        public Service()
        {
            _logger = IOC.Resolve<ILogger>();
            _serializer = new JavaScriptSerializer();
        }

        private string GetPostedJson()
        {
            string json;
            using (var reader = new StreamReader(Request.InputStream))
            {
                json = reader.ReadToEnd();
            }
            return json;
        }

        public object[] GetArray(object token)
        {
            object[] arr;
            var jobject = token as JToken;
            if (jobject.Type == JTokenType.Array)
            {
                arr = (token as JArray).ToArray();
            }
            else
            {
                arr = (token as JValue).Value.ToString().Split(',').ToArray();
            }
            return arr;
        }

        protected async void Page_Load(object sender, EventArgs e)
        {
            try
            {
                var data = (HttpContext.Current.Items["StrongTypeSession"] as IUserInfo);
                CallContext.LogicalSetData("StrongTypeSession", data);
                var d = CallContext.LogicalGetData("StrongTypeSession");
                _userInfo = IOC.Resolve<IUserInfo>();

                var context = HttpContext.Current;
                Response.Clear();
                Response.ContentType = ("text/html");
                Response.BufferOutput = true;

                if (null != Request.QueryString["rq"])
                {
                    _postedJson = GetPostedJson();
                    string keyword = Request.QueryString["rq"].Trim().ToLower();
                    string methodName = _serviceMethodInfo[keyword].Item1;
                    var callback = (Task<string>)_serviceType.InvokeMember(methodName, BindingFlags.InvokeMethod, null, this, new object[] { HttpContext.Current });
                    Response.Write(await callback);
                }
                else
                {
                    Response.Write("Please provide method keyword.");
                }
            }
            catch (System.Threading.ThreadAbortException) { }
            catch (OutOfMemoryException) { }
            catch (Exception ex)
            {
                Response.Write("An unexpected error has occured. Please try again or contact your administrator.");
                _logger.Error("Error", ex);
            }
            finally
            {
                HttpContext.Current.Response.Flush();
                HttpContext.Current.Response.SuppressContent = true;
                HttpContext.Current.ApplicationInstance.CompleteRequest();
            }
        }
    }
}