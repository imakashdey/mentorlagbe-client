"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import {
  getJwtToken,
  getMe,
  getToken,
  setToken,
  removeToken,
} from "@/lib/api";
import { User, Role } from "@/types";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isProfileDrawerOpen: boolean;
  openProfileDrawer: () => void;
  closeProfileDrawer: () => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (data: {
    name: string;
    email: string;
    password: string;
    role: "student" | "tutor";
  }) => Promise<boolean>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  isProfileDrawerOpen: false,
  openProfileDrawer: () => { },
  closeProfileDrawer: () => { },
  signIn: async () => false,
  signUp: async () => false,
  signOut: async () => { },
  refreshUser: async () => null,
  setUser: () => { },
});

const USER_STORAGE_KEY = "mentorlagbe_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState<boolean>(false);
  const router = useRouter();

  const openProfileDrawer = useCallback(() => setIsProfileDrawerOpen(true), []);
  const closeProfileDrawer = useCallback(() => setIsProfileDrawerOpen(false), []);

  // Load from local storage immediately on mount to prevent any redirect flickers
  useEffect(() => {
    let initialUser: User | null = null;
    let initialToken: string | null = null;

    try {
      const storedUser = localStorage.getItem(USER_STORAGE_KEY);
      if (storedUser) {
        initialUser = JSON.parse(storedUser);
        setUser(initialUser);
      }
      const storedToken = getToken();
      if (storedToken) {
        initialToken = storedToken;
        setTokenState(storedToken);
      }
    } catch (e) {
      console.error("Error reading stored user/token:", e);
    }

    // Verify session in background
    const syncSession = async () => {
      try {
        if (!initialToken && initialUser?.email) {
          try {
            initialToken = await getJwtToken(initialUser.email, initialUser.role);
            setTokenState(initialToken);
          } catch (e) {
            console.warn("Could not acquire initial JWT:", e);
          }
        }

        if (initialToken) {
          const freshUser = await getMe();
          if (freshUser) {
            setUser(freshUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
          }
        } else {
          // Check BetterAuth session
          const session = await authClient.getSession();
          if (session?.data?.user) {
            const u = session.data.user as any;
            const fullUser: User = {
              _id: u.id,
              id: u.id,
              name: u.name,
              email: u.email,
              role: (u.role as Role) || "student",
              plan: u.plan || "free",
              phone: u.phone,
              bio: u.bio,
              image: u.image,
            };
            setUser(fullUser);
            localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(fullUser));

            try {
              const jwt = await getJwtToken(fullUser.email, fullUser.role);
              setTokenState(jwt);
            } catch (err) {
              console.warn("Could not acquire JWT for active session:", err);
            }
          }
        }
      } catch (err) {
        console.error("Session verification failed:", err);
      } finally {
        setLoading(false);
      }
    };

    syncSession();
  }, []);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    try {
      const freshUser = await getMe();
      if (freshUser) {
        setUser(freshUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(freshUser));
        return freshUser;
      }
    } catch (err) {
      console.error("refreshUser failed:", err);
    }
    return null;
  }, []);

  const signIn = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (res?.error) {
        toast.error(res.error.message || "Invalid credentials");
        setLoading(false);
        return false;
      }

      // Obtain JWT token from backend
      let jwtToken: string | null = null;
      try {
        const detectedRole = (res.data?.user as any)?.role || "student";
        jwtToken = await getJwtToken(email.trim(), detectedRole);
        setTokenState(jwtToken);
      } catch (jwtErr) {
        console.warn("JWT request error:", jwtErr);
      }

      // Fetch fresh profile from backend
      let loggedUser: User | null = null;
      try {
        loggedUser = await getMe();
      } catch (meErr) {
        console.warn("getMe failed, using session data:", meErr);
        if (res.data?.user) {
          const u = res.data.user as any;
          loggedUser = {
            _id: u.id,
            id: u.id,
            name: u.name,
            email: u.email,
            role: (u.role as Role) || "student",
            plan: u.plan || "free",
            phone: u.phone,
            bio: u.bio,
            image: u.image,
          };
        }
      }

      if (loggedUser) {
        setUser(loggedUser);
        localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedUser));
      }

      toast.success("Welcome back!");

      // Redirect to home page upon sign in as requested
      router.push("/");
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Sign in failed");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (data: {
    name: string;
    email: string;
    password: string;
    role: "student" | "tutor";
  }): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: data.name.trim(),
        email: data.email.trim(),
        password: data.password,
        role: data.role,
      } as any);

      if (error) {
        toast.error(error.message || "Sign up failed");
        return false;
      }

      toast.success("Account created successfully! Please sign in.");
      return true;
    } catch (err: any) {
      toast.error(err?.message || "Sign up error");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await authClient.signOut();
    } catch (e) {
      console.warn("BetterAuth signOut error:", e);
    }
    removeToken();
    localStorage.removeItem(USER_STORAGE_KEY);
    setUser(null);
    setTokenState(null);
    toast.success("Signed out successfully");
    router.push("/sign-in");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isProfileDrawerOpen,
        openProfileDrawer,
        closeProfileDrawer,
        signIn,
        signUp,
        signOut,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
