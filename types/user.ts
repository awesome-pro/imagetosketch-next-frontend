export enum UserRole {
    ADMIN = "admin",
    USER = "user",
}

export enum UserStatus {
    ACTIVE = "active",
    INACTIVE = "inactive",
    SUSPENDED = "suspended",
    VERIFICATION_PENDING = "verification_pending",
}

export interface User { 
    id: string;
    email: string;
    role: UserRole;
    status: UserStatus;
    avatar_url: string;
}

export interface UserResponse extends User {
    is_oauth_user: boolean;
    name?: string;
    google_id: string;
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

export interface GoogleOAuthURL {
    auth_url: string;
}

export interface GoogleOAuthRequest {
    id_token: string;
}

export interface GoogleOAuthCallback {
    code: string;
    state?: string;
}