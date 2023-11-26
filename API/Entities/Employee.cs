using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using Entities.Enum.User;
using Entities.Enum.Record;

namespace Entities
{
    public class Employee : BaseEntity<Guid>
    {
        [ForeignKey("AppUser")]
        public Guid AppUserId { get; set; }
        public string? UserCode { get; set; }
        [Required, StringLength(50)]
        public string? FullName { get; set; }
        [Required]
        public bool Gender { get; set; }
        [Required, StringLength(50)]
        public string? Phone { get; set; }
        [Required]
        public DateTime DoB { get; set; }
        [Required]
        public Level Level { get; set; }
        [Required]
        public Guid? PositionId { get; set; }
        [ForeignKey("Department")]
        public Guid? DepartmentId { get; set; }
        [Required]
        public DateTime JoinDate { get; set; }
        public Guid Manager { get; set; }
        public bool IsActive { get; set; }
        public string? Bank { get; set; }
        public string? BankAccount { get; set; }
        public string? TaxCode { get; set; }
        public string? InsuranceStatus { get; set; }
        public string? Identify { get; set; }
        public string? PlaceOfOrigin { get; set; }
        public string? PlaceOfResidence { get; set; }
        public string? DateOfIssue { get; set; }
        public string? IssuedBy { get; set; }
        public RecordStatus Status { get; set; }
    }
}
