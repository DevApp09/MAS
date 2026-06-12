using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MAS.InversionOfControl;
using MAS.Authentications;

namespace MAS.EntityFramework.General
{
    public class MetaDataContex : Entities
    {
        protected IUserInfo _userInfo;

        public MetaDataContex() : this(IOC.Resolve<IUserInfo>()) { }

        public MetaDataContex(IUserInfo userInfo)
        {
            _userInfo = userInfo;
        }

        public override int SaveChanges()
        {
            var modifiedEntities = ChangeTracker.Entries().Where(p => p.State == EntityState.Modified).ToList();
            var addEntities = ChangeTracker.Entries().Where(p => p.State == EntityState.Added).ToList();

            foreach (var item in addEntities)
            {
                dynamic addEntity = item.Entity;
                addEntity.CreatedOn = DateTime.Now;
                addEntity.CreatedBy = 1;// _userInfo.UserID;
                addEntity.IP = _userInfo.IP;
                //addEntity.IP = GeneralMethods.GetCurrentIP();
            }

            foreach (var item in modifiedEntities)
            {
                dynamic updateEntity = item.Entity;
                updateEntity.UpdatedOn = DateTime.Now;
                updateEntity.UpdatedBy = 1;// _userInfo.UserID;
                updateEntity.IP = _userInfo.IP;
            }

            return base.SaveChanges();
        }
    }
}
