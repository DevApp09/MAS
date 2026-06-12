using System.Configuration;
using MAS.BusinessLogicLayer.Contract;

namespace MAS.BusinessLogicLayer
{
    public class Configuration : IConfiguration
    {
        public string GetFileStoragelocation => ConfigurationManager.AppSettings["FileStorageLocation"];
    }
}
