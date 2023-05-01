using HRM.Enum;
using System.ComponentModel.DataAnnotations.Schema;
using System;

namespace HRM.DTOs.EvaluateDto
{
    public class UpdateEvaluateDto
    {
        public Guid Id { get; set; }
        public Level NewLevel { get; set; }
        public string Note { get; set; }
    }
}
