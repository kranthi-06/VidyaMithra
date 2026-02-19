import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getMe, verifyOtp as verifyOtpApi, sendOtp as sendOtpApi } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface User {
    email: string;
    full_name?: string;
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

    // Check for existing token on mount
    // Check for existing token on mount and listen for Supabase auth changes
    // Unified Supabase Auth Logic
    useEffect(() => {
        let mounted = true;

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
                            setUser(userData);
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
                                setUser(userData);
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
                if (mounted) setLoading(false);
            }
        };

        initSession();

        // 2. Listen for auth changes (Login, Logout, OAuth Redirects)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Auth State Change:", event);

            if (event === 'SIGNED_IN' && session) {
                localStorage.setItem('token', session.access_token);
                try {
                    const userData = await getMe();
                    setUser(userData);
                    // Force navigation to dashboard on successful login
                    navigate('/dashboard');
                } catch (err) {
                    console.error("Backend sync failed on SIGNED_IN:", err);
                }
            } else if (event === 'SIGNED_OUT') {
                localStorage.removeItem('token');
                setUser(null);
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
            setUser(userData);
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
            setUser(userData);
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
                    redirectTo: window.location.origin + '/dashboard', // Or a callback route
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
        setUser(null);
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
