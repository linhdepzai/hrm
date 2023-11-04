using Entities.Enum;
using Entities.Enum.Project;

namespace Business.DTOs.ProjectDto
{
    public class CreateOrEditProjectDto
    {
        public Guid? Id { get; set; }
        public string ProjectName { get; set; }
        public string Description { get; set; }
        public ProjectType ProjectType { get; set; }
        public string ProjectCode { get; set; }
        public DateTime DeadlineDate { get; set; }
        public Priority PriorityCode { get; set; }
        public WorkStatus StatusCode { get; set; }
        public List<AddMemberToProjectDto> Members { get; set; }
    }
}
