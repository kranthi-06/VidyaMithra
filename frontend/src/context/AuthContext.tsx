import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { login as loginApi, register as registerApi, getMe, verifyOtp as verifyOtpApi, sendOtp as sendOtpApi } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface User {
    email: string;
    full_name?: string;
    profile?: {
        full_name?: string;
        // Add other profile fields if needed
    };
    is_active?: boolean;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<any>;
    verifyOtp: (email: string, otp: string) => Promise<void>;
    resendOtp: (email: string) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Ref to track current user state inside closures (avoids stale closure in useEffect)
    const userRef = useRef<User | null>(null);
    const updateUser = (u: User | null) => {
        userRef.current = u;
        setUser(u);
    };

    // Check for existing token on mount
    // Check for existing token on mount and listen for Supabase auth changes
    // Unified Supabase Auth Logic
    useEffect(() => {
        let mounted = true;
        // Track whether initial session has been loaded.
        // This prevents onAuthStateChange from redirecting to /dashboard
        // on token refresh / tab re-focus when the user is already on a page.
        let initialSessionLoaded = false;

        const initSession = async () => {
            try {
                // 1. Check active session (handles generic persistence AND some OAuth callbacks)
                const { data: { session } } = await supabase.auth.getSession();

                if (mounted) {
                    if (session) {
                        console.log("Session found on mount:", session.user.email);
                        localStorage.setItem('token', session.access_token);
                        try {
                            const userData = await getMe();
                            updateUser(userData);
                        } catch (err) {
                            console.error("Backend sync failed on mount:", err);
                        }
                    } else {
                        // fallback: check if we have a custom token (not supabase) in local storage?
                        // Our app mixes them. If getSession is null, maybe we have a legacy/custom token.
                        const localToken = localStorage.getItem('token');
                        if (localToken && localToken !== 'undefined') {
                            try {
                                const userData = await getMe();
                                updateUser(userData);
                            } catch (err) {
                                // Token invalid
                                localStorage.removeItem('token');
                            }
                        }
                    }
                }
            } catch (err) {
                console.error("Session init error:", err);
            } finally {
                // Determine if we should clear loading state
                if (mounted) {
                    const isOAuthCallback = window.location.hash.includes('access_token') ||
                        window.location.hash.includes('type=recovery') ||
                        window.location.search.includes('code');

                    if (isOAuthCallback) {
                        console.log("OAuth Callback detected. Waiting for Supabase event...");
                        // Safety timeout: If Supabase doesn't fire within 5s, unblock UI
                        setTimeout(() => {
                            if (mounted && loading) {
                                console.warn("Supabase auth timeout. Clearing loading state.");
                                setLoading(false);
                            }
                        }, 5000);
                    } else {
                        setLoading(false);
                    }
                }
                // Mark initial session as loaded so onAuthStateChange knows
                // any future SIGNED_IN events are just token refreshes.
                initialSessionLoaded = true;
            }
        };

        const sessionPromise = initSession();

        // 2. Listen for auth changes (Login, Logout, OAuth Redirects)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth State Change:", event);

            if (event === 'SIGNED_IN' && session) {
                // Always update the token in localStorage so API calls use the fresh token
                localStorage.setItem('token', session.access_token);
                try {
                    const userData = await getMe();
                    updateUser(userData);

                    // Only navigate to dashboard on a genuine NEW sign-in,
                    // NOT on token refresh / tab re-focus.
                    // Use userRef.current (not `user`) to avoid stale closure.
                    const isOAuthCallback = window.location.pathname === '/auth/callback';
                    const userWasAlreadyLoggedIn = initialSessionLoaded && userRef.current !== null;

                    if (!userWasAlreadyLoggedIn || isOAuthCallback) {
                        navigate('/dashboard');
                    } else {
                        console.log("Token refreshed silently — staying on current page.");
                    }
                } catch (err: any) {
                    console.error("Backend sync failed on SIGNED_IN:", err);
                    alert("Authentication Error: Failed to sync user with backend. " + (err.response?.data?.detail || err.message));
                    // If sync fails, we must NOT leave the user in a limbo state.
                    // Force logout so they can try again.
                    localStorage.removeItem('token');
                    await supabase.auth.signOut();
                    updateUser(null);
                    navigate('/login');
                }
            } else if (event === 'TOKEN_REFRESHED' && session) {
                // Supabase automatically refreshes tokens — just update localStorage silently.
                // Do NOT navigate or change user state, this preserves the current page.
                console.log("Token refreshed silently.");
                localStorage.setItem('token', session.access_token);
            } else if (event === 'SIGNED_OUT') {
                localStorage.removeItem('token');
                updateUser(null);
                navigate('/login');
            }
            // Ensure loading is false after any event
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = async (data: any) => {
        const response = await loginApi(data.username || data.email, data.password);
        if (response.access_token) {
            localStorage.setItem('token', response.access_token);
            const userData = await getMe();
            updateUser(userData);
            navigate('/dashboard');
        }
    };

    const register = async (data: any) => {
        const response = await registerApi(data);
        return response;
        // After signup, we DON'T auto-login. We need to verify OTP.
        // The UI should handle redirection to OTP verification page.
    };

    const verifyOtp = async (email: string, otp: string) => {
        const response = await verifyOtpApi(email, otp);
        if (response.access_token) {
            localStorage.setItem('token', response.access_token);
            const userData = await getMe();
            updateUser(userData);
        }
    };

    const resendOtp = async (email: string) => {
        await sendOtpApi(email);
    };

    const signInWithGoogle = async () => {
        try {
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: window.location.origin + '/auth/callback',
                },
            });
            if (error) throw error;
            // Supabase handles the redirect.
        } catch (error) {
            console.error("Google Sign-In Error:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        updateUser(null);
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            verifyOtp,
            resendOtp,
            signInWithGoogle,
            logout
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
