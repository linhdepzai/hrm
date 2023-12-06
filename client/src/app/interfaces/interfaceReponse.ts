import { Bank, Level, OptionRequestOff, Priority, ProjectType, Status, StatusTask } from "../enums/Enum";

export interface ApiResponse {
    statusCode: number,
    message: string,
    data: any,
}
export interface LoginResponse {
    id: string;
    avatar: string,
    fullName: string;
    gender: boolean;
    email: string,
    phone: string,
    doB: Date,
    level: Level,
    positionId: string,
    positionName: string,
    positionColor: string,
    departmentId: string,
    departmentName: string,
    departmentColor: string,
    startingDate: Date,
    bank: Bank | null,
    bankAccount: string,
    taxCode: string,
    insuranceStatus: string,
    identify: string,
    placeOfOrigin: string,
    placeOfResidence: string,
    dateOfIssue: string,
    issuedBy: string,
    userCode: string,
    token: string
}

export interface DepartmentResponse {
    id: string,
    name: string,
    color: string,
    icon: string,
    boss: string,
}

export interface RequestOffResponse {
    id: string,
    userId: string,
    avatarUser: string | null,
    dayOff: Date,
    option: OptionRequestOff,
    reason: string,
    status: Status,
    creationTime: Date,
    lastModifierUserId: string,
    lastModificationTime: Date,
}

export interface TimeWorkingResponse {
    id: string,
    userId: string,
    morningStartTime: Date,
    morningEndTime: Date,
    afternoonStartTime: Date,
    afternoonEndTime: Date,
    applyDate: Date,
    status: Status
}

export interface ProjectResponse {
    id: string,
    projectName: string,
    description: string,
    projectType: ProjectType,
    projectCode: string,
    createDate: Date,
    deadlineDate: Date,
    completeDate: Date | null,
    priorityCode: Priority,
    statusCode: StatusTask,
    pm: string
}

export interface IssueResponse {
    id: string,
    taskName: string,
    deadlineDate: Date,
    priorityCode: Priority,
    statusCode: StatusTask,
    description: string,
    taskType: string,
    taskCode: string,
    ProjectId: string,
    userId: string
}

export interface TimeKeepingResponse {
    id: string | null,
    employeeId: string,
    date: Date,
    checkin: Date,
    photoCheckin: string,
    checkout: Date,
    photoCheckout: string,
    complain: string,
    punish: boolean,
}

export interface Evaluate {
    id: string,
    dateEvaluate: Date,
    pmId: string,
    userId: string,
    oldLevel: Level,
    newLevel: Level,
    note: string,
    lastModifierUserId: string | null,
}

export interface Position {
    id: string | null,
    name: string,
    color: string,
}

export interface Payoff {
    id: string,
    userId: string,
    reason: string,
    amount: number,
    date: Date,
    punish: boolean,
}

export interface Salary {
    id: string,
    salaryCode: string,
    level: Level,
    positionId: string,
    money: number,
    welfare: number,
}

export interface SalaryForEmployee {
    id: string,
    userId: string,
    salary: string,
    date: Date,
    totalWorkdays: number,
    punish: number,
    bounty: number,
    actualSalary: number,
    isConfirm: number,
}

export interface Notification {
    id: string,
    thumbnail: string,
    title: string,
    content: string,
    type: string,
    createDate: Date,
    isRead: boolean,
    createUserId: string,
    createUserName: string,
    createUserPhoto: string,
    salary: any | null;
}

export interface Candidate {
    id: string,
    jobId: string,
    fullName: string,
    email: string,
    phone: string,
    fileCV: string,
    evaluate: string,
    status: number,
}

export interface Job {
    id: string,
    jobTitle: string,
    positionId: string,
    level: string,
    quantity: number,
    salaryRange: string,
    fromDate: Date,
    toDate: Date,
    description: string,
    require: string,
    visible: boolean
}