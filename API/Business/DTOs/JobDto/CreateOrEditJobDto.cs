using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.DTOs.JobDto
{
    public class CreateOrEditJobDto
    {
        public Guid? Id { get; set; }
        public string JobTitle { get; set; }
        public Guid PositionId { get; set; }
        public int Level { get; set; }
        public int Quantity { get; set; }
        public string SalaryRange { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public string Description { get; set; }
        public string Require { get; set; }
        public bool Visible { get; set; }
    }
}
