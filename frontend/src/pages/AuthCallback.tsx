import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AuthLoadingScreen from '../components/AuthLoadingScreen';

/**
 * This page is shown during OAuth callbacks (e.g., Google Sign-In redirect).
 * It displays a premium loading screen while the AuthContext processes the session.
 * Once the user is set, it redirects to the dashboard.
 * If auth fails, it redirects to login.
 */
export default function AuthCallback() {
    const { user, loading } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Only act when loading is complete
        if (!loading) {
            if (user) {
                navigate('/dashboard', { replace: true });
            } else {
                // Give a brief extra delay for the auth state change to fire
                const timeout = setTimeout(() => {
                    // Re-check - the onAuthStateChange might have fired by now
                    // and navigated us to /dashboard already
                    if (!user) {
                        navigate('/login', { replace: true });
                    }
                }, 3000);
                return () => clearTimeout(timeout);
            }
        }
    }, [user, loading, navigate]);

    return <AuthLoadingScreen />;
}
