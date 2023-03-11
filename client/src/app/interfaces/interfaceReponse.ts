import { Bank, Level, OptionOnLeave, Position, Status } from "../enums/Enum";

export interface LoginResponse {
    id: string;
    fullName: string;
    sex: boolean;
    email: string,
    phone: string,
    doB: Date,
    level: Level,
    position: Position,
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
    issuedBy: string
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
    status: Status
}
