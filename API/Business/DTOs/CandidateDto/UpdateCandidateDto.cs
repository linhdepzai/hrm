using Entities.Enum.Recuitment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.DTOs.CandidateDto
{
    public class UpdateCandidateDto
    {
        public Guid Id { get; set; }
        public Guid JobId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string Evaluate { get; set; }
        public StatusCandidate Status { get; set; }
    }
}
