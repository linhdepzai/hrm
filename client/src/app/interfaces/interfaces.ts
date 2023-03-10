import { Level, Position } from "../enums/Enum";

export interface Login {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface Employee {
    id: string | null,
    fullName: string,
    sex: true,
    email: string,
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