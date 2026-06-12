using AutoMapper;
using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.InversionOfControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.BusinessLogicLayer
{
    public static class Bootstrapper
    {
        public static void InitDataTransferObjectMapping()
        {
            var mapperConfig = new MapperConfiguration((cfg)
                =>
            {
                //cfg.CreateMap<Category, CategoryDTO>();
            });

            IOC.RegisterInstance<IMapper>(mapperConfig.CreateMapper());
        }
    }
}
