using Entities.Enum.Recuitment;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Entities
{
    public class Candidate : BaseEntity<Guid>
    {
        public Guid JobId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }
        public string FileCV { get; set; }
        public string Evaluate { get; set; }
        public StatusCandidate Status { get; set; }
    }
}
