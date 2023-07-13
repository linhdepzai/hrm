using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Services
{
    public class BaseService
    {
        protected IMapper? ObjectMapper { get; set; }
    }
}
