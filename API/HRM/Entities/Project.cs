using HRM.Enum;
using Microsoft.AspNetCore.Http;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using System;

namespace HRM.Entities
{
    public class Project
    {
        [Key]
        public Guid Id { get; set; }
        [Required, StringLength(50)]
        public string ProjectName { get; set; }
        public string Description { get; set; }
        [Required, StringLength(50)]
        public ProjectType ProjectType { get; set; }
        [Required, StringLength(50)]
        public string ProjectCode { get; set; }
        [Required]
        public DateTime CreateDate { get; set; }
        [Required]
        public DateTime DeadlineDate { get; set; }
        public DateTime? CompleteDate { get; set; }
        [Required]
        public Priority PriorityCode { get; set; }
        [Required]
        public StatusTask StatusCode { get; set; }
        public ICollection<Task> Task { get; set; }
    }
}
