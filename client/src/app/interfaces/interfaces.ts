import { Level, Position, Priority, ProjectType, StatusTask } from "../enums/Enum";

export interface Login {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface Employee {
    id: string | null,
    userCode: string,
    fullName: string,
    sex: true,
    email: string,
    password: string,
    phone: string,
    doB: Date,
    level: Level,
    position: Position,
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
}

export interface Department {
    id: string,
    name: string,
    color: string,
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