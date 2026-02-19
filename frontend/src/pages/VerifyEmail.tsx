import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ShieldCheck, Mail, ArrowRight } from 'lucide-react';

export default function VerifyEmail() {
    const { state } = useLocation();
    const [email, setEmail] = useState(state?.email || '');
    const [otp, setOtp] = useState('');
    const { verifyOtp, resendOtp } = useAuth();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' | 'info' } | null>(null);
    const navigate = useNavigate();

    const showToast = (message: string, type: 'success' | 'error' | 'info') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            await verifyOtp(email, otp);
            showToast('Email verified successfully! Redirecting to login...', 'success');
            setTimeout(() => navigate('/login'), 2000);
        } catch (err: any) {
            console.error('Verification Error:', err);
            let errorMsg = 'Verification failed. Invalid OTP.';
            if (err.response?.data?.detail) {
                errorMsg = err.response.data.detail;
            }
            setError(errorMsg);
            showToast(errorMsg, 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 font-sans">
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className={`fixed top-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-xl shadow-2xl text-white z-[100] font-medium flex items-center gap-2 ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    >
                        {toast.type === 'success' ? <CheckCircle2 size={18} /> : <ShieldCheck size={18} />}
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8"
            >
                <div className="text-center space-y-4 mb-8">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto text-indigo-600">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900">Verify Your Email</h2>
                    <p className="text-slate-500">
                        We sent a verification code to <span className="font-semibold text-slate-700">{email}</span>
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="otp" className="text-sm font-semibold text-slate-700">One-Time Password (OTP)</Label>
                        <Input
                            id="otp"
                            required
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="text-center text-2xl tracking-widest py-6 rounded-xl border-slate-200 focus:border-indigo-500 focus:ring-indigo-500 bg-slate-50 focus:bg-white transition-all"
                            placeholder="123456"
                            maxLength={6}
                        />
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 font-medium bg-red-50 p-3 rounded-lg flex items-center gap-2">
                            <ShieldCheck size={16} /> {error}
                        </p>
                    )}

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-xl font-bold text-lg shadow-lg"
                    >
                        {isLoading ? "Verifying..." : "Verify & Login"} <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-slate-500 text-sm mb-2">Didn't receive the code?</p>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={async () => {
                            try {
                                showToast('Resending code...', 'info');
                                await resendOtp(email);
                                showToast('Verification code resent!', 'success');
                            } catch (err: any) {
                                showToast(err.message || 'Failed to resend code', 'error');
                            }
                        }}
                        className="text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                        Resend Verification Code
                    </Button>
                </div>
            </motion.div>
        </div>
    );
}
