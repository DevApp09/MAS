using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MAS.DataTransferObject
{
    public class SurveyDeploymentInitDataDTO
    {
        public IEnumerable<UserDTO2> UsersList { get; set; }
        public int[] Assignees { get; set; }
        public int[] Managers { get; set; }
    }
}
