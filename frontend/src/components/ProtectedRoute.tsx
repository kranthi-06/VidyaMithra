import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLoadingScreen from './AuthLoadingScreen';

export const ProtectedRoute = ({ children }: { children: React.ReactElement }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return <AuthLoadingScreen />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return children;
};
