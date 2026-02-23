import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLoadingScreen from './AuthLoadingScreen';

interface AdminRouteProps {
    children: React.ReactElement;
    requireBlackAdmin?: boolean;
}

export const AdminRoute = ({ children, requireBlackAdmin = false }: AdminRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <AuthLoadingScreen />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const role = user.role || 'user';

    if (requireBlackAdmin && role !== 'black_admin') {
        return <Navigate to="/dashboard" replace />;
    }

    if (!requireBlackAdmin && role !== 'admin' && role !== 'black_admin') {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};
