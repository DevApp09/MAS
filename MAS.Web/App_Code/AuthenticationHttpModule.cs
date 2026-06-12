using MAS.Authentications;
using System;
using System.Configuration;
using System.Threading;
using System.Web;
using MAS.InversionOfControl;
using System.Data.SqlClient;
using MAS.Utility;
using System.Data;
using System.Runtime.Remoting.Messaging;
using Newtonsoft.Json;
using MAS.Exceptions;
using MAS.DataTransferObject;

namespace MAS.Web.App_Code
{
    public class AuthenticationHttpModule : IHttpModule
    {
        private const string Token = "Token";
        private const string StrongTypeSession = "StrongTypeSession";
        private const string ModuleCode = "MAS";

        public void Dispose()
        {
        }

        public void Init(HttpApplication context)
        {
            context.BeginRequest += begin_request;
        }

        public void begin_request(object sender, EventArgs e)
        {
            try
            {
                var context = ((HttpApplication)sender).Context;
                if (!context.Request.RawUrl.Contains(".aspx") || context.Request.RawUrl.Contains("Login.aspx") || context.Request.RawUrl.Contains("UserIsValid"))
                {
                    return;
                }

                var token = context.Request.Cookies[Token] ?? new HttpCookie(Token);

                if (token == null)
                {
                    throw new InvalidTokenException("No token is provided with request.");
                }

                UserInformation data;
                try
                {
                    try
                    {
                        //MAS.Authentications.StringCipher.Decrypt(token.Value, ConfigurationManager.AppSettings["EncryptionKey"]);
                        Utility.StringCipher.DecodeToken(token.Value);
                    }
                    catch (Exception ex)
                    {
                        var excep = ex;
                    }
                    try
                    {
                        Utility.StringCipher.Decrypt(token.Value, ConfigurationManager.AppSettings["EncryptionKey"]);
                    }
                    catch (Exception ex)
                    {
                        var excep = ex;
                    }
                    //data = JsonConvert.DeserializeObject<UserInformation>(Utility.StringCipher.Decrypt(token.Value, ConfigurationManager.AppSettings["EncryptionKey"]));
                    data = JsonConvert.DeserializeObject<UserInformation>(token.Value);
                }
                catch (JsonSerializationException)
                {
                    throw new InvalidTokenException("Invalid token received.");
                }

                if (data != null && (DateTime.Now - data.CreatedDate).TotalHours > 24)
                {
                    context.Request.Cookies.Remove(Token);
                    throw new InvalidTokenException("Token has been expired.");
                }

                IUserInfo userInfo = IOC.Resolve<IUserInfo>();

                userInfo.UserInformation = data;
                HttpContext.Current.Items.Add(StrongTypeSession, userInfo);

                userInfo.SetIP(context.Request.UserHostAddress);

                HttpContext.Current.Items.Remove(StrongTypeSession);
                HttpContext.Current.Items.Add(StrongTypeSession, userInfo);

                //if (context.Request.RawUrl.Contains("OnlineExam.aspx"))
                //{
                //    return;
                //}
            }
            catch (InvalidTokenException ex)
            {
                throw new HttpException(404, ex.Message);
            }
            catch (ThreadAbortException) { }
            catch (Exception)
            {
                throw new HttpException(404, "HTTP/1.1 404 Unauthorized");
            }
        }

        private static long GetID(int userID)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["SecurityConnectionString"].ToString();
            var query = "[SchMS].[SP_GetEntityIDFromUserID]";
            var parameters = new SqlParameter[]
                {
                    new SqlParameter("@UserID", userID){SqlDbType = SqlDbType.Int}
                };
            return (long)SqlHelper.ExecuteScalerSP(connectionString, query, parameters);
        }
    }
}