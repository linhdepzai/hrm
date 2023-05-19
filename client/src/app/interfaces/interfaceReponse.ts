import { Bank, Level, OptionOnLeave, Priority, ProjectType, Status, StatusTask } from "../enums/Enum";

export interface ApiResponse {
    statusCode: number,
    message: string,
    data: any,
}
export interface LoginResponse {
    id: string;
    fullName: string;
    sex: boolean;
    email: string,
    phone: string,
    doB: Date,
    level: Level,
    position: number,
    departmentId: string,
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
    token: string,
}

export interface DepartmentResponse {
    id: string,
    name: string,
    color: string,
    icon: string
}

export interface OnLeaveResponse {
    id: string,
    employeeId: string,
    dateLeave: Date,
    option: OptionOnLeave,
    reason: string,
    status: Status,
    creationTime: Date,
    lastModifierUserId: string,
    lastModificationTime: Date,
}

export interface TimeWorkingResponse {
    id: string,
    employeeId: string,
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
    employeeId: string,
    oldLevel: Level,
    newLevel: Level,
    note: string,
    lastModifierUserId: string | null,
}

export interface Position {
    id: number,
    name: string,
    color: string,
}

export interface Payoff {
    id: string,
    employeeId: string,
    reason: string,
    amount: number,
    date: Date,
}

export interface Salary {
    id: string,
    salaryCode: string,
    level: Level,
    position: number,
    money: number,
    welfare: number,
}

export interface SalaryForEmployee {
    id: string,
    employeeId: string,
    salary: string,
    date: Date,
    totalWorkdays: number,
    punish: number,
    bounty: number,
    actualSalary: number
}