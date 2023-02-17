export interface LoginForm {
    userNameOrEmailAddress: string;
    password: string;
    rememberClient: boolean;
}

export interface LoginResponse {
    result: {
        accessToken: string;
        encryptedAccessToken: string;
        expireInSeconds: number;
        userId: number;
    };
    targetUrl: string;
    success: boolean;
    error: string;
    unAuthorizedRequest: boolean;
    __abp: boolean;
}