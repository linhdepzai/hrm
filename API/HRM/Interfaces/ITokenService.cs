using HRM.Entities;

namespace HRM.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(Employee employee);
    }
}
