
namespace Business.DTOs.NotificationDto
{
    public class CreateOrEditNotificationDto
    {
        public Guid? Id { get; set; }
        public Guid ActionId { get; set; }
        public string Thumbnail { get; set; }
        public string Title { get; set; }
        public string Content { get; set; }
        public List<Employee> Employee { get; set; }
    }
    public class Employee
    {
        public Guid EmployeeId { get; set; }
    }
}
