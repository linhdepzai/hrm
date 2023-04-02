using HRM.Enum;
using System.ComponentModel.DataAnnotations;
using System;

namespace HRM.DTOs.ProjectDto
{
    public class GetAllProjectDto
    {
        public Guid Id { get; set; }
        public string ProjectName { get; set; }
        public string Description { get; set; }
        public ProjectType ProjectType { get; set; }
        public string ProjectCode { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime DeadlineDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        public Priority PriorityCode { get; set; }
        public StatusTask StatusCode { get; set; }
        public string Pm { get; set; }
    }
}
