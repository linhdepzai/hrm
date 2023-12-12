using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Interfaces.ICandidateService
{
    public interface ICandidateService
    {
        public Task<string> FileUploadAsync(IFormFile file, string fileName);
    }
}
