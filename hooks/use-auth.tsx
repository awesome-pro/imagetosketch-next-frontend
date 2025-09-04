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


interface AuthState{
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
  | { type: "SIGN_OUT" };

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
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true });

        const sessionResponse = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });


        const session = await sessionResponse.json();

        if (session?.isSignedIn && sessionResponse.ok) {
          let userData = session.user;
          
          if (!userData) {
            try {
              userData = (await authApi.getMe()).data;
            } catch (error: any) {
              dispatch({
                type: "SET_ERROR",
                payload: "Failed to fetch user data"
              });
              return;
            }
          }

          if (userData) {
            dispatch({
              type: "INITIALIZE",
              payload: {
                ...initialState,
                isAuthenticated: true,
                user: {
                  ...userData,
                },
                error: null,
                isLoading: false,
              },
            });

            if (isAuthPage){
              switch(userData.status){            
                case UserStatus.INACTIVE:
                  router.push('/inactive');
                  break;
                case UserStatus.ACTIVE:
                  router.push("/dashboard");
                  break;
                default:
                  router.push("/account/status");
                  break;
              }
            }
            return;
          }
        }

        // No valid session, initialize with default state and set loading to false
        dispatch({ type: "SET_LOADING", payload: false });

        if (!isAuthPage){
          toast.error('Session expired. Please sign in again.', { duration: 5000 });
          router.push('/auth/sign-in?redirectUrl=' + encodeURIComponent(window.location.pathname));
        }
      } catch (error: any) {
        dispatch({
          type: "INITIALIZE",
          payload: { ...initialState, isLoading: false, error: error.message },
        });
        if (!isAuthPage) router.push("/auth/sign-in");
      }
    };

    if (!state.isInitialized && mounted) {
      initAuth();
    }
  }, [router, isAuthPage, state.isInitialized, mounted]);

  const signIn = useCallback(
    async (input: LoginInput): Promise<{ user: User | null; error?: { code: string; message: string } }> => {
      dispatch({ type: "SET_LOADING", payload: true });
      try {

        const user = (await authApi.login(input)).data;
        if (user) {
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
        }
        throw new Error("Sign in failed");
      } catch (error: any) {   
        const errorMessage = error.message;
        
        dispatch({ type: "SET_LOADING", payload: false });
        dispatch({ type: "SET_ERROR", payload: errorMessage });
       
        return { 
          user: null, 
          error: { 
            code: 'UNKNOWN_ERROR', 
            message: errorMessage 
          } 
        };
      }
    },
    [authApi]
  );

  const signOut = useCallback(async () => {

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      await authApi.signOut();
      dispatch({ type: "SIGN_OUT" });
      router.push("/auth/sign-in");
    } catch (error: any) {
      toast.error("Failed to sign out. Please try again.");
      dispatch({ type: "SET_ERROR", payload: "Failed to sign out" });
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [authApi, router]);

  const signUp = useCallback(async (input: RegisterInput): Promise<User> => {
    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const user = (await authApi.signUp(input)).data;
      return user
    } catch (error: any) {
      toast.error(error.message);
      dispatch({ type: "SET_ERROR", payload: error.message });
      throw error;
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, [authApi]);

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
      <main className="w-screen h-screen flex items-center justify-center">
        <p>Please wait...</p>
      </main>
    )
  }

  if (!state.isInitialized && !isAuthPage) {
    return (
      <section className="flex items-center justify-center h-screen w-screen">
        <LoaderIcon
          className="w-4 h-4 animate-spin"
        />
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