using Entities;
using Entities.Enum.User;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Business.DTOs.EmployeeDto
{
    public class GetAllEmployeeForViewDto
    {
        public Guid? Id { get; set; }
        public Guid AppUserId { get; set; }
        public string UserCode { get; set; }
        public List<AppRole> Roles { get; set; }
        public string FullName { get; set; }
        public bool Gender { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public DateTime DoB { get; set; }
        public Level Level { get; set; }
        public Guid? PositionId { get; set; }
        public Guid? DepartmentId { get; set; }
        public DateTime JoinDate { get; set; }
        public Guid? Manager { get; set; }
        public string? Bank { get; set; }
        public string? BankAccount { get; set; }
        public string? TaxCode { get; set; }
        public string? InsuranceStatus { get; set; }
        public string? Identify { get; set; }
        public string? PlaceOfOrigin { get; set; }
        public string? PlaceOfResidence { get; set; }
        public string? DateOfIssue { get; set; }
        public string? IssuedBy { get; set; }
    }
}
