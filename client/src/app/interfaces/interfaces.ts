import { Level, Priority, ProjectType, Status, StatusTask } from "../enums/Enum";

export interface Login {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface Role {
    id: string,
    name: string,
}

export interface Employee {
    id: string | null,
    appUserId: string | null,
    roles: Role[],
    avatar: string,
    userCode: string,
    fullName: string,
    gender: true,
    email: string,
    password: string,
    phone: string,
    doB: Date,
    level: Level,
    positionId: string,
    departmentId: string,
    joinDate: Date,
    manager: string,
    bank: string,
    bankAccount: string,
    taxCode: string,
    insuranceStatus: string,
    identify: string,
    placeOfOrigin: string,
    placeOfResidence: string,
    dateOfIssue: string,
    issuedBy: string,
    status: Status,
}

export interface Department {
    id: string,
    name: string,
    color: string,
    icon: string,
    boss: string,
}

export interface CreateProject {
    id: string | null,
    projectName: string,
    description: string,
    projectType: ProjectType,
    projectCode: string,
    deadlineDate: Date | null,
    priorityCode: Priority,
    statusCode: StatusTask,
    members: MemberProject[],
}

export interface MemberProject {
    employeeId: string,
    type: 1 | 2,
}

export interface CheckinOrCheckout {
    id: string | null,
    employeeId: string,
    checkin: Date,
    photoCheckin: string,
    checkout: Date,
    photoCheckout: string,
}

export interface ChangePassword {
    currentPassword: string,
    newPassword: string,
}

export interface WorkingTimeRequest {
    employeeId: string,
    morningStartTime: Date,
    morningEndTime: Date,
    afternoonStartTime: Date,
    afternoonEndTime: Date,
    applyDate: Date,
}

export interface Message {
    id: string;
    senderId: string;
    senderUserName: string;
    senderPhotoUrl: string,
    recipientId: string;
    recipientUserName: string;
    recipientPhotoUrl: string,
    content: string;
    dateRead?: Date;
    messageSent: Date;
    totalUnSeen: number,
}

export interface NotificationPayload {
    id: string,
    actionId: string,
    thumbnail: string,
    title: string,
    content: string,
    employee: EmployeeId[],
}

export interface EmployeeId {
    userId: string
}

export interface NotificationSalaryPayload {
    month: number,
    year: number,
    employee: EmployeeId[],
}

export interface UpdateSalaryPayload {
    id: string,
    salary: string,
    totalWorkdays: number,
    punish: number,
    bounty: number,
  }
  
