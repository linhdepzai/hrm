using System;

namespace HRM.DTOs.AccountDto
{
    public class ChangePasswordDto
    {
        public Guid Id { get; set; }
        public string Email { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
        public string ConfirmPassword { get; set; }
    }
}
