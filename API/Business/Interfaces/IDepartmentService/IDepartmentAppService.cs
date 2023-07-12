using Business.DTOs.DepartmentDto;
using Business.DTOs.MessageDto;
using Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Interfaces.IDepartmentService
{
    public interface IDepartmentAppService
    {
        public Task<List<DepartmentForViewDto>> GetAll();
    }
}
