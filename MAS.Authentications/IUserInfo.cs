using System;
using System.Collections.Generic;

namespace MAS.Authentications
{
    public interface IUserInfo
    {
        UserInformation UserInformation { get; set; }
        void SetIP(string ip);
        //Role GetRole(string moduleCode);
        //Role CurrentRole { get; }
        int UserID { get; }
        string UserFullName { get; }
        DateTime CreatedDate { get; }
        string IP { get; }
    }
}
