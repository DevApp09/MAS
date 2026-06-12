using MAS.DataTransferObject;
using MAS.EntityFramework;
using MAS.EntityFramework.General;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataAccessLayer
{
    public class UserRepository : GenericRepository<User>
    {
        public UserRepository(GeneralDbContext context) : base(context)
        {
        }

        public IEnumerable<UserDTO> GetAll()
        {
            var data = (from u in _context.Users.AsQueryable()
                        select new UserDTO()
                        {
                            UserID = u.Id,
                            Name = u.FullName
                        }).ToList();
            return data;
        }

        public IEnumerable<UserDTO2> GetAll2()
        {
            var data = (from u in _context.Users.AsQueryable()
                        select new UserDTO2()
                        {
                            UserID = u.Id,
                            UserName = u.FullName,
                            RoleId = u.UserRole,
                            RoleName = u.UserRoleName
                        }).ToList();
            return data;
        }


        public UserInformationDTO GetValidUser(string email, string password)
        {
            var data = (from u in _context.Users.AsQueryable()
                        where u.Email1.ToLower() == email.ToLower() && u.Password == password
                        select new UserInformationDTO()
                        {
                            UserID = u.Id,
                            RoleID = u.UserRole,
                            Role = u.UserRoleName,
                            Name = u.FullName,
                            Login = u.Email1,
                            Password = password,
                            IsActive = true,
                            IsDeleted = false,
                            UserLoginID = u.Email1,
                            UserFullName = u.FullName,
                        }).FirstOrDefault();
            return data;
        }
    }
}
