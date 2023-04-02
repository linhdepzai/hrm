using HRM.Enum;
using System;

namespace HRM.DTOs.AccountDto
{
    public class ChangeInfoDto
    {
        public string UserCode { get; set; }
        public string FullName { get; set; }
        public bool Sex { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Phone { get; set; }
        public DateTime DoB { get; set; }
        public DateTime StartingDate { get; set; }
        public string Bank { get; set; }
        public string BankAccount { get; set; }
        public string TaxCode { get; set; }
        public string InsuranceStatus { get; set; }
        public string Identify { get; set; }
        public string PlaceOfOrigin { get; set; }
        public string PlaceOfResidence { get; set; }
        public string DateOfIssue { get; set; }
        public string IssuedBy { get; set; }
    }
}
