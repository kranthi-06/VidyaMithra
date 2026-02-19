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
    useEffect(() => {
        const initAuth = async () => {
            let token = localStorage.getItem('token');

            // If no local token, check if Supabase has a session (e.g. after OAuth redirect)
            if (!token) {
                const { data } = await supabase.auth.getSession();
                if (data.session) {
                    token = data.session.access_token;
                    localStorage.setItem('token', token);
                }
            }

            if (token) {
                try {
                    // Validate token by fetching user profile
                    const userData = await getMe();
                    setUser(userData);
                } catch (error) {
                    console.error("Token invalid or expired", error);
                    localStorage.removeItem('token');
                    setUser(null);
                }
            } else {
                // Check if we are in an OAuth callback flow
                const isOAuthCallback = window.location.hash.includes('access_token') ||
                    window.location.search.includes('code') ||
                    window.location.hash.includes('type=recovery');

                if (isOAuthCallback) {
                    console.log("OAuth Callback detected. Waiting for Supabase processing...");
                    return; // Keep loading=true until onAuthStateChange fires
                }
            }
            setLoading(false);
        };
        initAuth();

        // Listen for Supabase Auth Changes (e.g. Google Login Redirect)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("Supabase Auth Event:", event);

            if (event === 'SIGNED_IN' && session) {
                localStorage.setItem('token', session.access_token);
                try {
                    const userData = await getMe();
                    setUser(userData);

                    // Only navigate if we are on the login page or strict redirect needed
                    // navigate('/dashboard'); 
                    // Better to let the router handle it or only if explicit
                    navigate('/dashboard');
                } catch (error) {
                    console.error("Failed to sync Supabase user with backend", error);
                }
                setLoading(false);
            } else if (event === 'SIGNED_OUT') {
                // If signed out from Supabase, also clear local state
                setLoading(false);
            } else if (event === 'INITIAL_SESSION') {
                // Handle initial session check if missed by initAuth
                if (session) {
                    localStorage.setItem('token', session.access_token);
                    const userData = await getMe();
                    setUser(userData);
                }
                setLoading(false);
            }
        });

        return () => {
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
