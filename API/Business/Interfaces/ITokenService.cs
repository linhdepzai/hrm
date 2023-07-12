using Entities;

namespace Business.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(Employee employee);
    }
}
