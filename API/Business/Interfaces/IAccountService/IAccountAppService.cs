using Business.DTOs.AccountDto;
using Entities;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Interfaces.IAccountService
{
    public interface IAccountAppService
    {
        public void AddAsync(LoginDto input);
        public void UpdateAsync(LoginDto input);
        public Task<bool> SaveChangeAsync();
        public void DeleteAsync();
    }
}
