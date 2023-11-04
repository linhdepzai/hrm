using Entities.Enum;
using Entities.Enum.Project;
using System;

namespace Business.DTOs.ProjectDto
{
    public class AddMemberToProjectDto
    {
        public Guid EmployeeId { get; set; }
        public MemberType Type { get; set; }
    }
}
