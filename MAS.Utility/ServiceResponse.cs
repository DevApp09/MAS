using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Utility
{
    public sealed class ServiceResponse
    {
        public const string UnExpectedErrorResponse = "{\"HasError\":true,\"ErrorMessage\":\"An unexpected error has occured. Please try again or contact your administrator.\",\"ErrorClass\":\"Exception\",\"Data\":null}";
        public const string AuthenticationErrorResponse = "{\"HasError\":true,\"ErrorMessage\":\"Please login again and then try.\",\"ErrorClass\":\"SecurityClass\",\"Data\":null}";
        public const string SuccessResponse = "{\"HasError\":false,\"ErrorMessage\":null,\"ErrorClass\":null,\"Data\":null}";

        public ServiceResponse() { }
        public bool HasError { get; set; }
        public string ErrorMessage { get; set; }
        public string ErrorClass { get; set; }
        public object Data { get; set; }

        public static string GetErrorResponse(ErrorClass errorClass, string msg, object data)
        {
            return new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(new ServiceResponse()
            {
                ErrorClass = errorClass.ToString(),
                ErrorMessage = msg,
                HasError = true,
                Data = data
            });
        }

        public static string GetOKResponse(object data)
        {
            return new System.Web.Script.Serialization.JavaScriptSerializer().Serialize(new ServiceResponse()
            {
                ErrorClass = null,
                ErrorMessage = null,
                HasError = false,
                Data = data
            });
        }
    }

    public enum ErrorClass
    {
        DAL,
        BLL,
        Authentication,
        General,
    }
}
