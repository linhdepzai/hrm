using Entities.Enum;
using System;

namespace Business.DTOs.ProjectDto
{
    public class AddMemberToProjectDto
    {
        public Guid EmployeeId { get; set; }
        public MemberType Type { get; set; }
    }
}
