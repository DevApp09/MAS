using System;
using System.Collections.Generic;
using System.Configuration;
using System.Runtime.Remoting.Messaging;
using System.Linq;
using System.Reflection;

namespace MAS.Authentications
{
    public class UserInfo : IUserInfo
    {
        private string STRONGTYPESESSION = "StrongTypeSession";
        private const string MODULE_CODE = "SchMS";

        private UserInformation _userInformation;
        private string _ip;
        private long _employeeID;
        private long _teacherID;
        private long _studentID;
        private long _parentID;

        public UserInfo()
        {
            //if (HttpContext.Current == null) return;

            var abc = (CallContext.LogicalGetData(STRONGTYPESESSION) as IUserInfo);
            if (abc == null)
            {
                return;
            }
            else
            {
                _userInformation = abc.UserInformation;
                _ip = abc.IP;
            }
        }

        public string UserLoginID => _userInformation.UserLoginID;
        public int UserID => _userInformation.UserID;
        public string UserFullName => _userInformation.UserFullName;
        public DateTime CreatedDate => _userInformation.CreatedDate;
        public string IP => _ip;
        public UserInformation UserInformation
        { get => _userInformation; set => _userInformation = value; }

        //public Role CurrentRole => GetRole(MODULE_CODE);

        //public Role GetRole(string moduleCode)
        //{
        //    return _userInformation.Modules.Where(m => string.Equals(m.ShortName, moduleCode, StringComparison.OrdinalIgnoreCase)).Single().Role;
        //}

        public void SetIP(string ip)
        {
            _ip = ip;
        }
    }
}
