using MAS.Authentications;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Utility
{
    public static class Helper
    {
        public const string ENCRYPTION_KEY = "EncryptionKeyMAS";
        public const string APPLICATION_NAME = "SMS";

        public static string GenerateToken(this UserInformation userInformation)
        {
            return JsonConvert.SerializeObject(userInformation).Encrypt(ConfigurationManager.AppSettings[ENCRYPTION_KEY]);
        }
    }
}
