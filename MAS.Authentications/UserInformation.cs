using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace MAS.Authentications
{
    public class UserInformation : ISerializable
    {
        public string UserLoginID { get; set; }
        public int UserID { get; set; }
        public string UserFullName { get; set; }
        public DateTime CreatedDate { get; set; }

        public UserInformation()
        {

        }

        public void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("UserLoginID", UserLoginID, typeof(string));
            info.AddValue("UserID", UserID, typeof(string));
            info.AddValue("UserFullName", UserFullName, typeof(string));
            info.AddValue("CreatedDate", CreatedDate, typeof(DateTime));
        }

        public UserInformation(SerializationInfo info, StreamingContext context)
        {
            // Reset the property value using the GetValue method.
            UserLoginID = (string)info.GetValue("UserLoginID", typeof(string));
            UserID = (int)info.GetValue("UserID", typeof(int));
            UserFullName = (string)info.GetValue("UserFullName", typeof(string));
            CreatedDate = (DateTime)info.GetValue("CreatedDate", typeof(DateTime));
        }
    }

    //public static class UserInformationBOExtension
    //{
    //    public static long GetSelectedBranch(this UserInformationBO bo)
    //    {
    //        return (long)HttpContext.Current.Session["DefaultBranch"];
    //    }
    //}

    public class Role : ISerializable
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public int RoleTypeID { get; set; }

        public void GetObjectData(SerializationInfo info, StreamingContext context)
        {
            info.AddValue("ID", ID, typeof(int));
            info.AddValue("Name", Name, typeof(string));
            info.AddValue("RoleTypeID", RoleTypeID, typeof(int));
        }

        public Role()
        {

        }

        public Role(SerializationInfo info, StreamingContext context)
        {
            // Reset the property value using the GetValue method.
            ID = (int)info.GetValue("ID", typeof(int));
            Name = (string)info.GetValue("Name", typeof(string));
            RoleTypeID = (int)info.GetValue("RoleTypeID", typeof(int));
        }
    }

    public enum RoleType
    {
        SuperAdmin = 0,
        Admin = 1,
        User = 2
    }

}
