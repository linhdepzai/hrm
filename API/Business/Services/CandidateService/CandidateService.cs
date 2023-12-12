using Azure.Storage.Files.Shares;
using Azure;
using Business.DTOs;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Business.Interfaces.ICandidateService;
using Microsoft.Extensions.Options;

namespace Business.Services.CandidateService
{
    public class CandidateService : ICandidateService
    {
        private readonly FileShareSettings _fileShareSettings;
        public CandidateService(IOptionsMonitor<FileShareSettings> fileShareSettings)
        {
            _fileShareSettings = fileShareSettings.CurrentValue;
        }
        public async Task<string> FileUploadAsync(IFormFile file, string fileName)
        {
            // Get the configurations and create share object
            ShareClient share = new(_fileShareSettings.ConnectionStrings, _fileShareSettings.FileShareName);

            // Create the share if it doesn't already exist
            await share.CreateIfNotExistsAsync();

            // Get a reference to the sample directory
            ShareDirectoryClient directory = share.GetDirectoryClient("AttachmentOfIssue");

            // Create the directory if it doesn't already exist
            await directory.CreateIfNotExistsAsync();

            // Get a reference to a file and upload it
            ShareFileClient shareFile = directory.GetFileClient(fileName);

            using Stream stream = file.OpenReadStream();
            shareFile.Create(stream.Length);

            int blockSize = 4194304;
            long offset = 0;//Define http range offset
            BinaryReader reader = new(stream);
            while (true)
            {
                byte[] buffer = reader.ReadBytes(blockSize);
                if (offset == stream.Length)
                {
                    break;
                }
                else
                {
                    MemoryStream uploadChunk = new();
                    uploadChunk.Write(buffer, 0, buffer.Length);
                    uploadChunk.Position = 0;

                    HttpRange httpRange = new(offset, buffer.Length);
                    var response = shareFile.UploadRange(httpRange, uploadChunk);
                    offset += buffer.Length;//Shift the offset by number of bytes already written
                }
            }
            reader.Close();

            return shareFile.Uri.AbsoluteUri;
        }
        private async Task<Response> DeleteFileAsync(string fileName)
        {
            ShareClient share = new(_fileShareSettings.ConnectionStrings, _fileShareSettings.FileShareName);

            // Create the share if it doesn't already exist
            await share.CreateIfNotExistsAsync();

            // Get a reference to the sample directory
            ShareDirectoryClient directory = share.GetDirectoryClient("AttachmentOfIssue");

            // Create the directory if it doesn't already exist
            await directory.CreateIfNotExistsAsync();

            // Get a reference to a file and upload it
            ShareFileClient shareFile = directory.GetFileClient(fileName);
            var reponse = shareFile.Delete();
            return reponse;
        }
    }
}
