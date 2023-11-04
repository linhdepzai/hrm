using System.ComponentModel.DataAnnotations.Schema;

namespace Entities
{
    public class AppUserRole
    {
        public Guid Id { get; set; }
        [ForeignKey("AppUser")]
        public Guid? UserId { get; set; }
        [ForeignKey("AppRole")]
        public Guid? RoleId { get; set; }
    }
}
