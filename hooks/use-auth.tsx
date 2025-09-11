"use client";

import React, {
  createContext,
  useContext,
  ReactNode,
  useCallback,
  useEffect,
  useReducer,
  useMemo,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import { LoginInput, RegisterInput, User, UserStatus } from "@/types";
import authApi from "@/services/auth.service";
import { LoaderIcon } from "lucide-react";
import Link from "next/link";

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  user: User | null;
  error: string | null;
}

type AuthAction =
  | { type: "INITIALIZE"; payload: AuthState }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "UPDATE_SESSION"; payload: Partial<AuthState> }
  | { type: "SIGN_OUT" }
  | { type: "RESET_TO_UNAUTHENTICATED" };

interface AuthContextType extends AuthState {
  signIn: (input: LoginInput) => Promise<{ user: User | null; error?: { code: string; message: string } }>;
  signUp: (input: RegisterInput) => Promise<User>;
  signOut: () => Promise<void>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  isInitialized: false,
  user: null,
  error: null,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "INITIALIZE":
      return { ...action.payload, isInitialized: true, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "UPDATE_SESSION":
      return { ...state, ...action.payload };
    case "SIGN_OUT":
      return { ...initialState, isInitialized: true, isLoading: false };
    case "RESET_TO_UNAUTHENTICATED":
      return { 
        ...initialState, 
        isInitialized: true, 
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: null
      };
    default:
      return state;
  }
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);
  const [mounted, setMounted] = React.useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const isAuthPage = pathname?.startsWith("/auth/");

  const forceSignOut = useCallback(async (showToast = true) => {
    try {
      await fetch("/api/auth/session", {
        method: "DELETE",
        credentials: "include",
      });
    } catch (error) {
      console.warn("Failed to clear server session:", error);
    }

    dispatch({ type: "RESET_TO_UNAUTHENTICATED" });
    
    if (showToast && !isAuthPage) {
      toast.error('Session invalid. Please sign in again.', { duration: 5000 });
    }
    
    if (!isAuthPage) {
      const redirectUrl = encodeURIComponent(window.location.pathname);
      router.push(`/auth/sign-in?redirectUrl=${redirectUrl}`);
    }
  }, [router, isAuthPage]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        // Step 1: Check if there's a valid session
        const sessionResponse = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });

        // If session endpoint fails or returns non-ok status, force sign out
        if (!sessionResponse.ok) {
          console.warn("Session check failed:", sessionResponse.status);
          await forceSignOut(false);
          return;
        }

        const session = await sessionResponse.json();

        // If no valid session or user is not signed in, force sign out
        if (!session?.isSignedIn) {
          console.warn("No valid session found");
          await forceSignOut(!isAuthPage);
          return;
        }

        // Step 2: Validate user data by fetching from /me endpoint
        let userData = session.user;
        
        try {
          // Always fetch fresh user data to ensure it's valid and up-to-date
          const meResponse = await authApi.getMe();
          userData = meResponse.data;
        } catch (error: any) {
          console.error("Failed to fetch user data from /me:", error);
          await forceSignOut(!isAuthPage);
          return;
        }

        // Step 3: Validate that user data is complete and valid
        if (!userData || !userData.id) {
          console.error("Invalid user data received:", userData);
          await forceSignOut(!isAuthPage);
          return;
        }

        // Step 4: User is fully authenticated and validated
        dispatch({
          type: "INITIALIZE",
          payload: {
            ...initialState,
            isAuthenticated: true,
            user: userData,
            error: null,
            isLoading: false,
          },
        });

        // Step 5: Handle routing based on user status (only if on auth page)
        if (isAuthPage) {
          switch (userData.status) {
            case UserStatus.INACTIVE:
              router.push('/inactive');
              break;
            case UserStatus.ACTIVE:
              router.push("/app");
              break;
            default:
              router.push("/account/status");
              break;
          }
        }

      } catch (error: any) {
        console.error("Auth initialization error:", error);
        
        // Any unexpected error during auth init should force sign out
        await forceSignOut(!isAuthPage);
      }
    };

    if (!state.isInitialized && mounted) {
      initAuth();
    }
  }, [router, isAuthPage, state.isInitialized, mounted, forceSignOut]);

  const signIn = useCallback(
    async (input: LoginInput): Promise<{ user: User | null; error?: { code: string; message: string } }> => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {
        const user = (await authApi.login(input)).data;
        
        if (!user || !user.id) {
          throw new Error("Invalid user data received from login");
        }

        dispatch({
          type: "UPDATE_SESSION",
          payload: {
            isAuthenticated: true,
            isLoading: false,
            user: user,
            error: null,
          },
        });
        
        return { user: user, error: undefined };
      } catch (error: any) {
        const errorMessage = error.message || "Sign in failed";
        
        dispatch({ type: "SET_LOADING", payload: false });
        dispatch({ type: "SET_ERROR", payload: errorMessage });

        return {
          user: null,
          error: {
            code: error.status === 401 ? 'INVALID_CREDENTIALS' : 'UNKNOWN_ERROR',
            message: errorMessage
          }
        };
      }
    },
    []
  );

  const signOut = useCallback(async () => {
    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await authApi.signOut();
      dispatch({ type: "SIGN_OUT" });
      router.push("/auth/sign-in");
    } catch (error: any) {
      console.error("Sign out error:", error);
      dispatch({ type: "SIGN_OUT" });
      router.push("/auth/sign-in");
      toast.error("Signed out (with some issues). Please sign in again.");
    }
  }, [router]);

  const signUp = useCallback(async (input: RegisterInput): Promise<User> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const user = (await authApi.signUp(input)).data;
      
      if (!user || !user.id) {
        throw new Error("Invalid user data received from registration");
      }
      
      return user;
    } catch (error: any) {
      const errorMessage = error.message || "Registration failed";
      toast.error(errorMessage);
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  const value = useMemo(
    () => ({
      ...state,
      signIn,
      signUp,
      signOut,
    }),
    [state, signIn, signUp, signOut]
  );

  if (!mounted) {
    return (
      <main className="w-screen h-screen flex flex-col items-center justify-center gap-4">
        <LoaderIcon className="h-6 w-6 animate-spin mb-4" />
        <h6>
          <Link href={'https://abhinandan.pro'} target="_blank" className="text-primary font-semibold mr-2">
            Abhinandan
          </Link> 
          is trying to mount up the React Context...
        </h6>
      </main>
    );
  }

  if (!state.isInitialized && !isAuthPage) {
    return (
      <section className="flex flex-col items-center justify-center h-screen w-screen gap-4">
        <LoaderIcon className="h-6 w-6 animate-spin mb-4" />
        <h6>
          <Link href={'https://abhinandan.pro'} target="_blank" className="text-primary font-semibold mr-2">
            Abhinandan
          </Link> 
          is initializing the useAuth to make sure its you ❤️
        </h6>
      </section>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}