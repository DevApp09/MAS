using MAS.Authentications;
using MAS.InversionOfControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Remoting.Messaging;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace MAS.Web
{
    public partial class Site : System.Web.UI.MasterPage
    {
        private IUserInfo _userInfo;
        protected void Page_Load(object sender, EventArgs e)
        {
            var data = (HttpContext.Current.Items["StrongTypeSession"] as IUserInfo);
            CallContext.LogicalSetData("StrongTypeSession", data);
            _userInfo = IOC.Resolve<IUserInfo>();
        }
    }
}