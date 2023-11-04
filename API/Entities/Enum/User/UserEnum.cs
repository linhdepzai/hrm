using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities.Enum.User
{
    public enum UserType : short
    {
        Admin = 1,
        Employee = 2,
    }

    public enum Level
    {
        Intern = 1,
        Fresher = 2,
        Senior = 3,
        Middle = 4,
        Junior = 5,
    }

    public enum Gender : ushort
    {
        Female = 0,
        Male = 1,
    }
}
