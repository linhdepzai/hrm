using Business.DTOs.CandidateDto;
using Business.DTOs.JobDto;
using Business.DTOs.NotificationDto;
using Business.Interfaces;
using Business.Interfaces.ICandidateService;
using Business.Services;
using Business.Services.CandidateService;
using Database;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace HRM.Controllers
{
    public class CandidateController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly IPhotoService _photoService;
        private readonly ICandidateService _candidateService;
        private readonly IUploadFileService _uploadFileService;

        public CandidateController(DataContext dataContext, IPhotoService photoService, ICandidateService candidateService, IUploadFileService uploadFileService)
        {
            _dataContext = dataContext;
            _photoService = photoService;
            _candidateService = candidateService;
            _uploadFileService = uploadFileService;
        }
        [HttpGet("{userId}/get-all")]
        public async Task<IActionResult> GetAll(Guid userId)
        {
            var candidates = await _dataContext.Candidate.Where(i => i.IsDeleted == false).AsNoTracking().ToListAsync();
            return CustomResult(candidates);
        }
        [HttpPost("create")]
        public async Task<IActionResult> Create(CreateCandidateDto input)
        {
            var newCandidate = new Candidate
            {
                Id = new Guid(),
                CreatorUserId = new Guid("00000000-0000-0000-0000-000000000000"),
                JobId = input.JobId,
                FullName = input.FullName,
                Email = input.Email,
                Phone = input.Phone,
                FileCV = input.FileCV,
                Status = Entities.Enum.Recuitment.StatusCandidate.Waiting,
                Evaluate = ""
            };
            await _dataContext.Candidate.AddAsync(newCandidate);
            await _dataContext.SaveChangesAsync();
            return CustomResult(newCandidate);
        }
        [HttpPut("{userId}/update")]
        public async Task<IActionResult> Update(UpdateCandidateDto input, Guid userId)
        {
            var candidate = await _dataContext.Candidate.FindAsync(input.Id);
            if (candidate != null)
            {
                candidate.LastModifierUserId = userId;
                candidate.JobId = input.JobId;
                candidate.FullName = input.FullName;
                candidate.Email = input.Email;
                candidate.Phone = input.Phone;
                candidate.Evaluate = input.Evaluate;
                candidate.Status = input.Status;
            }
            _dataContext.Candidate.Update(candidate);
            await _dataContext.SaveChangesAsync();
            return CustomResult(candidate);
        }
        [HttpDelete("{userId}/delete")]
        public async Task<IActionResult> Delete(Guid id, Guid userId)
        {
            var candidate = await _dataContext.Candidate.FindAsync(id);
            candidate.DeleteUserId = userId;
            _dataContext.Update(candidate);
            _dataContext.Candidate.Remove(candidate);
            await _dataContext.SaveChangesAsync();
            return CustomResult("Removed");
        }

        [HttpPost("upload-cv")]
        public async Task<IActionResult> UploadCV(IFormFile file)
        {
            var res = _uploadFileService.UploadFile(file);
            return CustomResult(file.FileName);
        }

        [HttpGet("download-cv")]
        public async Task<IActionResult> DownloadCV(string filename)
        {
            var res = _uploadFileService.DownloadFile(filename);
            if(res is null)
            {
                return CustomResult(null, HttpStatusCode.NoContent);
            }
            string contentType = "";
            if (filename.Contains("jpg") || filename.Contains("jpeg"))
            {
                contentType = "image/jpeg";
            } 
            else if (filename.Contains("png"))
            {
                contentType = "image/png";
            }
            else if (filename.Contains("pdf"))
            {
                contentType = "application/pdf";
            }
            else if (filename.Contains("doc"))
            {
                contentType = "application/msword";
            }
            else if (filename.Contains("docx"))
            {
                contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            }
            res.Position = 0;
            return File(res, contentType, filename);
        }
    }
}