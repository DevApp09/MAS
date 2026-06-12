using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Data.Sql;

namespace MAS.Web
{
    public class Global : System.Web.HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup
            RouteConfig.RegisterRoutes(RouteTable.Routes);

            //var v = System.Data.Entity.SqlServer.SqlProviderServices.Instance;
            bootstrapper.Init();
        }

        void Application_Error(object sender, EventArgs e)
        {
            Exception exc = Server.GetLastError();

            if (exc.Message.Contains("404"))
            {
                Response.Redirect(System.Configuration.ConfigurationManager.AppSettings["LoginPage"]);
            }
        }
        //protected void Application_Start(object sender, EventArgs e)
        //{
        //    // Code that runs on application startup
        //    RouteConfig.RegisterRoutes(RouteTable.Routes);

        //    //var v = System.Data.Entity.SqlServer.SqlProviderServices.Instance;
        //    bootstrapper.Init();
        //}

        //protected void Session_Start(object sender, EventArgs e)
        //{

        //}

        //protected void Application_BeginRequest(object sender, EventArgs e)
        //{

        //}

        //protected void Application_AuthenticateRequest(object sender, EventArgs e)
        //{

        //}

        //protected void Application_Error(object sender, EventArgs e)
        //{
        //    Exception exc = Server.GetLastError();

        //    if (exc.Message.Contains("404"))
        //    {
        //        Response.Redirect(System.Configuration.ConfigurationManager.AppSettings["LoginPage"]);
        //    }
        //}

        //protected void Session_End(object sender, EventArgs e)
        //{

        //}

        //protected void Application_End(object sender, EventArgs e)
        //{

        //}
    }
}