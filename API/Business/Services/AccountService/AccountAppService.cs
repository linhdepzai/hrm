using Business.DTOs.AccountDto;
using Business.Interfaces.IAccountService;
using Database;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Services.AccountService
{
    public class AccountAppService : IAccountAppService
    {
        private readonly DataContext _context;

        public AccountAppService(DataContext context)
        {
            _context = context;
        }

        public void AddAsync(LoginDto input)
        {
            throw new NotImplementedException();
        }

        public void DeleteAsync(LoginDto input)
        {
            throw new NotImplementedException();
        }

        public void DeleteAsync()
        {
            throw new NotImplementedException();
        }

        public void SaveChangeAsync(LoginDto input)
        {
            throw new NotImplementedException();
        }

        public Task<bool> SaveChangeAsync()
        {
            throw new NotImplementedException();
        }

        public async Task<bool> UpdateAsync(LoginDto input)
        {
            return await _context.SaveChangesAsync() > 0;
        }

        void IAccountAppService.UpdateAsync(LoginDto input)
        {
            throw new NotImplementedException();
        }
    }
}
