import { api } from "@/lib/api";
import { GoogleOAuthCallback, GoogleOAuthRequest, GoogleOAuthURL, User } from "@/types";
import { LoginInput, RegisterInput } from "@/types";

const authApi = {
    
    login: async (credentials: LoginInput) => {
      return api.post<User>('/auth/sign-in', credentials);
    },
  
    signUp: async (data: RegisterInput) => {
      return api.post<User>('/auth/sign-up', data);
    },
  
    signOut: async () => {
      return api.post('/auth/sign-out');
    },
  
    getMe: async () => {
      return api.get<User>('/auth/me');
    },

    getProfile: async () => {
      return api.get<User>('/auth/profile');
    },

    resendVerificationEmail: async (email: string) => {
      return api.post('/auth/resend-verification-email', { email });
    },
    getGoogleAuthUrl: async () => {
      return api.get<GoogleOAuthURL>('/auth/google/url');
    },
    googleOAuthCallback: async (callbackData: GoogleOAuthCallback) => {
      return api.post<User>('/auth/google/callback', callbackData);
    },

    googleOAuthVerify: async (tokenData: GoogleOAuthRequest) => {
      return api.post<User>('/auth/google/verify', tokenData);
    },
  };

  export default authApi;