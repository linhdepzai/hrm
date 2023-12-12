using Business.DTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.Interfaces
{
    public interface IUploadFileService
    {
        bool UploadFile(IFormFile file);
        Task FileUploadAsync(FileDetails fileDetails);
        Task FileDownloadAsync(string fileShareName);
        Stream? DownloadFile(string filename);
    }
}
