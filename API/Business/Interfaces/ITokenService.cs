using Entities;

namespace Business.Interfaces
{
    public interface ITokenService
    {
        string CreateToken(string email, string name);
    }
}
