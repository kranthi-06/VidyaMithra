import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as loginApi, register as registerApi, getMe } from '../services/auth';
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
    register: (data: any) => Promise<void>;
    signInWithGoogle: () => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initAuth = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const userData = await getMe();
                    setUser(userData);
                } catch (error) {
                    localStorage.removeItem('token');
                }
            }
            // Check for Supabase session if redirected from OAuth
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                // If we have a Supabase session, we should handle exchanging it for a backend token
                // For now, let's keep it simple and at least set the user if we don't have one
                if (!user && session.user) {
                    setUser({
                        email: session.user.email || '',
                        full_name: session.user.user_metadata?.full_name,
                        is_active: true
                    });
                }
            }
            setLoading(false);
        };
        initAuth();

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
            if (session?.user) {
                localStorage.setItem('token', session.access_token);

                setUser({
                    email: session.user.email || '',
                    full_name: session.user.user_metadata?.full_name,
                    is_active: true
                });

                // Navigate only if on auth pages
                if (window.location.pathname === '/login' || window.location.pathname === '/register' || window.location.pathname === '/') {
                    navigate('/dashboard');
                }
            } else {
                localStorage.removeItem('token');
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    return () => subscription.unsubscribe();
}, []);

const login = async (data: any) => {
    const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
    });
    if (error) throw error;
    // onAuthStateChange will handle user state update
};

const register = async (data: any) => {
    const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
            data: {
                full_name: data.full_name,
                username: data.username,
            }
        }
    });
    if (error) throw error;
    // Check if email confirmation is required? Supabase default is often confirmation required.
    // User behavior depends on Supabase settings.
};

const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo: import.meta.env.VITE_AUTH_CALLBACK_URL || window.location.origin,
        },
    });
    if (error) throw error;
};

const logout = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
};

return (
    <AuthContext.Provider value={{ user, loading, login, register, signInWithGoogle, logout }}>
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
