using Microsoft.Extensions.Configuration;
using System.Security.Claims;
using System.Text;
using Business.Interfaces;
using Microsoft.IdentityModel.Tokens;
using Entities;
using System.IdentityModel.Tokens.Jwt;
using Database;

namespace HRM.Services
{
    public class TokenService : ITokenService
    {
        private readonly SymmetricSecurityKey _key;
        private readonly DataContext _context;
        public TokenService(IConfiguration config)
        {
            _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config.GetSection("JWTToken:Key").Value!));
        }

        public string CreateToken(string email, string name)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, email),
                new Claim(JwtRegisteredClaimNames.UniqueName, name)
            };
            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}
