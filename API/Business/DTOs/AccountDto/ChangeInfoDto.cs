using System;

namespace Business.DTOs.AccountDto
{
    public class ChangeInfoDto
    {
        public string? Phone { get; set; }
        public string? Bank { get; set; }
        public string? BankAccount { get; set; }
        public string? TaxCode { get; set; }
        public string? InsuranceStatus { get; set; }
        public string? PlaceOfOrigin { get; set; }
        public string? PlaceOfResidence { get; set; }
        public string? DateOfIssue { get; set; }
        public string? IssuedBy { get; set; }
    }
}
