using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class UserInformationDTO
    {
        public int UserID { get; set; }
        public int RoleID { get; set; }
        public string Role { get; set; }
        public string Name { get; set; }
        public string Login { get; set; }
        public string Password { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsDeleted { get; set; }

        public string UserLoginID { get; set; }
        public string UserFullName { get; set; }
    }
}
