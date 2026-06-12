using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Unity;
using Unity.Resolution;

namespace MAS.InversionOfControl
{
    public static class IOC
    {
        private static UnityContainer _unityContainer;

        public static UnityContainer Container
        {
            get
            {
                return _unityContainer;
            }
            set
            {
                if (null == value)
                {
                    throw new ArgumentNullException("Can not be null.");
                }
                else
                {
                    _unityContainer = value;

                }
            }
        }

        public static T Resolve<T>()
        {
            return _unityContainer.Resolve<T>();

        }

        public static T Resolve<T>(params KeyValuePair<string, object>[] parameters)
        {
            var parametersOverrides = from p in parameters
                                      select new ParameterOverride(p.Key, p.Value);


            return _unityContainer.Resolve<T>(parametersOverrides.ToArray());
        }

        public static void RegisterInstance<T>(T instance)
            where T : class
        {
            _unityContainer.RegisterInstance<T>(instance);
        }
    }
}
