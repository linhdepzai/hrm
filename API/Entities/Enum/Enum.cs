namespace Entities.Enum
{
    public enum Level
    {
        Intern = 1,
        Fresher = 2,
        Senior = 3,
        Middle = 4,
        Junior = 5,
    }
    public enum Status
    {
        New = 1,
        Pending = 2,
        Approved = 3,
        Rejected = 4,
    }
    public enum OptionOnLeave
    {
        OffMorning = 1,
        OffAfternoon = 2,
        OffFullDay = 3,
        Late = 4,
        LeaveEarly = 5,
    }
    public enum Priority
    {
        Normal = 1,
        Low = 2,
        Medium = 3,
        High = 4,
        Urgent = 5
    }
    public enum StatusTask
    {
        Reopened = 1,
        Open = 2,
        InProgress = 3,
        Resolve = 4,
        Closed = 5
    }
    public enum MemberType
    {
        ProjectManager = 1,
        Member = 2,
    }
    public enum ProjectType
    {
        TM = 1,
        FF = 2,
        NB = 3,
        ODC = 4,
        Product = 5,
        Training = 6,
    }
}
