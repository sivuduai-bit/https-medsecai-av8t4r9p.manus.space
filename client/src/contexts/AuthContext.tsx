import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { AuthState, User, parseJwt, STORAGE_KEY } from "@/lib/auth";

interface AuthContextType extends AuthState {
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const [location, setLocation] = useLocation();

  useEffect(() => {
    const initAuth = () => {
      // 1. Check URL params for token (SSO handoff)
      const params = new URLSearchParams(window.location.search);
      let token = params.get('token');

      // 2. Check LocalStorage (Shared domain persistence)
      if (!token) {
        token = localStorage.getItem(STORAGE_KEY);
      }

      if (token) {
        const decoded = parseJwt(token);
        
        // Basic validation - check expiration if exp exists
        if (decoded) {
          const isExpired = decoded.exp && decoded.exp * 1000 < Date.now();
          
          if (!isExpired) {
            // Save token if it came from URL
            if (params.get('token')) {
              localStorage.setItem(STORAGE_KEY, token);
              // Clean URL
              const newUrl = window.location.pathname;
              window.history.replaceState({}, document.title, newUrl);
            }

            // Map JWT claims to User object
            // Adjust these field names based on your actual JWT structure
            const user: User = {
              id: decoded.sub || decoded.id || 'unknown',
              name: decoded.name || decoded.preferred_username || 'User',
              email: decoded.email || '',
              role: decoded.role || decoded.groups?.[0] || 'user',
              avatar: decoded.picture || decoded.avatar,
            };

            setState({
              user,
              token,
              isAuthenticated: true,
              isLoading: false,
            });
            return;
          }
        }
      }

      // No valid token found
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    };

    initAuth();
  }, []);

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    // Redirect to main platform login
    window.location.href = "https://medsecai-av8t4r9p.manus.space/login";
  };

  return (
    <AuthContext.Provider value={{ ...state, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
