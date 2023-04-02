using HRM.Enum;
using System;

namespace HRM.DTOs.ProjectDto
{
    public class AddMemberToProjectDto
    {
        public Guid EmployeeId { get; set; }
        public MemberType Type { get; set; }
    }
}
