using Business.DTOs.CandidateDto;
using Business.DTOs.JobDto;
using Business.DTOs.NotificationDto;
using Business.Interfaces;
using Business.Services;
using Database;
using Entities;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HRM.Controllers
{
    public class CandidateController : BaseApiController
    {
        private readonly DataContext _dataContext;
        private readonly IPhotoService _photoService;
        public CandidateController(DataContext dataContext, IPhotoService photoService)
        {
            _dataContext = dataContext;
            _photoService = photoService;
        }
        [HttpGet("{userId}/get-all")]
        public async Task<IActionResult> GetAll(Guid userId)
        {
            var candidates = await _dataContext.Candidate.Where(i => i.IsDeleted == false).AsNoTracking().ToListAsync();
            return CustomResult(candidates);
        }
        [HttpPost("upload-cv")]
        public async Task<IActionResult> UploadCV(IFormFile file)
        {
            var result = await _photoService.AddPhotoAsync(file);

            if (result.Error != null) return CustomResult(result.Error.Message, System.Net.HttpStatusCode.BadRequest);

            return CustomResult(result.SecureUrl.AbsoluteUri);
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
                FileCV = input.FileCV
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
    }
}