export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
}

export interface User { 
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
}

export interface UserResponse extends User {
    hashed_password: string;
    created_at: Date;
    updated_at: Date;
}

export interface UserListResponse {
    users: UserResponse[];
    total: number;
    page: number;
    limit: number;
}

export interface LoginInput {
    email: string;
    password: string;
}

export interface RegisterInput {
    email: string;
    password: string;
}