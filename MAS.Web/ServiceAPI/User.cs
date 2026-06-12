using System;
using System.Collections.Generic;
using System.Web;
using MAS.InversionOfControl;
using MAS.Utility;
using MAS.BusinessLogicLayer.Contract;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using MAS.Exceptions;
using MAS.Web.App_Start;
using MAS.DataTransferObject;

namespace MAS.Web
{
    public partial class Service : System.Web.UI.Page
    {
        [RequestDirectTo("UserIsValid")]
        public async Task<string> UserIsValid(HttpContext context)
        {
            try
            {
                var jObject = JsonConvert.DeserializeObject(_postedJson) as JObject;
                var login = ((JValue)jObject["Login"]).Value<string>();
                var password = ((JValue)jObject["Password"]).Value<string>();

                var bll = IOC.Resolve<IUserBLL>();
                var entities = await bll.IsValidAsync(login, password);
                if (null != entities)
                {
                    if (entities.IsDeleted)
                        return ServiceResponse.GetErrorResponse(ErrorClass.BLL, "You are not authorized to login the sysyem. Please contact administrator.", null);

                    if (entities.IsActive == false)
                        return ServiceResponse.GetErrorResponse(ErrorClass.BLL, "You are not authorized to login the sysyem. Please contact administrator.", null);

                    var token = new UserInformationDTO
                    {
                        UserID = entities.UserID,
                        Login = entities.Login,
                        Name = entities.Name,
                        Role = entities.Role,
                        RoleID = entities.RoleID,
                        CreatedDate = DateTime.Now,
                        UserLoginID = entities.Login,
                        UserFullName = entities.UserFullName,
                    };

                    //Session["RoleId"] = entities.RoleID;
                    //Session["UserId"] = entities.UserID;

                    Response.Cookies.Add(new HttpCookie("Token", JsonConvert.SerializeObject(token)));
                }
                return ServiceResponse.GetOKResponse(entities);
            }
            catch (DALException ex)
            {
                return ServiceResponse.GetErrorResponse(ErrorClass.DAL, ex.Message, null);
            }
            catch (BLLException ex)
            {
                return ServiceResponse.GetErrorResponse(ErrorClass.BLL, ex.Message, null);
            }
            catch (Exception ex)
            {
                _logger.Error("Error", ex);
                if (ex.InnerException != null && ex.InnerException.Message.Contains("Could not open a connection to SQL Server"))
                    return ServiceResponse.GetErrorResponse(ErrorClass.Authentication, "Could not open a connection to Database", null);
                return ex.Message;
            }
        }

        [RequestDirectTo("UserIsValidNew")]
        public async Task<string> UserIsValidNew(HttpContext context)
        {
            try
            {
                var jObject = JsonConvert.DeserializeObject(_postedJson) as JObject;
                var login = ((JValue)jObject["Login"]).Value<string>();
                var password = ((JValue)jObject["Password"]).Value<string>();

                var bll = IOC.Resolve<IUserBLL>();
                var entities = await bll.IsValidAsync(login, password);
                if (null != entities)
                {
                    if (entities.IsDeleted)
                        return ServiceResponse.GetErrorResponse(ErrorClass.BLL, "You are not authorized to login the sysyem. Please contact administrator.", null);

                    if (entities.IsActive == false)
                        return ServiceResponse.GetErrorResponse(ErrorClass.BLL, "You are not authorized to login the sysyem. Please contact administrator.", null);

                    var token = new MAS.Authentications.UserInformation
                    {
                        UserID = entities.UserID,
                        //Login = entities.Login,
                        //Name = entities.Name,
                        //Role = entities.Role,
                        //RoleID = entities.RoleID,
                        CreatedDate = DateTime.Now,
                        UserLoginID = entities.Login,
                        UserFullName = entities.UserFullName,
                    }.GenerateToken();
                    Response.Cookies.Add(new HttpCookie("Token", JsonConvert.SerializeObject(token)));
                }
                return ServiceResponse.GetOKResponse(entities);
            }
            catch (DALException ex)
            {
                return ServiceResponse.GetErrorResponse(ErrorClass.DAL, ex.Message, null);
            }
            catch (BLLException ex)
            {
                return ServiceResponse.GetErrorResponse(ErrorClass.BLL, ex.Message, null);
            }
            catch (Exception ex)
            {
                _logger.Error("Error", ex);
                if (ex.InnerException != null && ex.InnerException.Message.Contains("Could not open a connection to SQL Server"))
                    return ServiceResponse.GetErrorResponse(ErrorClass.Authentication, "Could not open a connection to Database", null);
                return ex.Message;
            }
        }
    }
}