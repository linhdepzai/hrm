import { Level, Priority, ProjectType, Status, StatusTask } from "../enums/Enum";

export interface Login {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface Employee {
    id: string | null,
    avatar: string,
    userCode: string,
    fullName: string,
    sex: true,
    email: string,
    password: string,
    phone: string,
    doB: Date,
    level: Level,
    position: number,
    departmentId: string,
    startingDate: Date,
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
    id: string,
    email: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string,
}

export interface WorkingTimeRequest {
    employeeId: string,
    morningStartTime: Date,
    morningEndTime: Date,
    afternoonStartTime: Date,
    afternoonEndTime: Date,
    applyDate: Date,
}

export interface Notification {
    id: string;
    content: string;
    employeeId: string;
    createDate: Date;
    isRead: boolean;
    anyId?: string;
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
