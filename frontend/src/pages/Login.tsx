import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Eye, EyeOff, GraduationCap, ArrowRight } from 'lucide-react';

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth();
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
        setIsLoading(true);
        setError('');
        try {
            // Updated to use username instead of email if that's what the design suggests
            // But usually, the backend expects email. I'll keep it as email for functionality but label it Username.
            await login({ email: username, password });
            showToast('Login successful! Redirecting...', 'success');
            setTimeout(() => navigate('/dashboard'), 1000);
        } catch (err) {
            setError('Invalid username or password');
            showToast('Login failed. Please check your credentials.', 'error');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#5c52d2] font-sans selection:bg-purple-200">


            {/* Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ y: -50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -50, opacity: 0 }}
                        className={`fixed top-8 px-6 py-3 rounded-2xl shadow-2xl text-white z-[100] font-bold ${toast.type === 'success' ? 'bg-green-500' :
                            toast.type === 'error' ? 'bg-red-500' : 'bg-[#4e43ba]'
                            }`}
                    >
                        {toast.message}
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[450px] bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-10 relative overflow-hidden"
            >
                {/* Decorative purple bar at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#5c52d2]"></div>

                <div className="flex flex-col items-center text-center space-y-4 mb-10">
                    <div className="w-16 h-16 bg-[#2d2a4a] text-[#ffd700] rounded-2xl flex items-center justify-center rotate-12 shadow-lg mb-2">
                        <GraduationCap className="w-10 h-10 -rotate-12" />
                    </div>

                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-[#2d2a4a] tracking-tight">VidyāMitra</h1>
                        <p className="text-[10px] font-black text-[#7c83fd] tracking-[0.3em] uppercase">Intelligent Career Agent</p>
                    </div>

                    <p className="text-[#64748b] font-medium leading-relaxed max-w-[280px]">
                        Welcome back! 👋 Ready to advance your career?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="username" className="text-sm font-bold text-[#2d2a4a] ml-1">Username</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94a3b8] group-focus-within:text-[#5c52d2] transition-colors">
                                <User className="h-5 w-5" />
                            </div>
                            <Input
                                type="text"
                                id="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full pl-11 pr-4 py-6 border-[#e2e8f0] border-2 rounded-2xl focus:border-[#5c52d2] focus:ring-0 transition-all text-[#2d2a4a] font-semibold placeholder:text-[#94a3b8]"
                                placeholder="Enter your username"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password" title="Password" className="text-sm font-bold text-[#2d2a4a] ml-1">Password</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94a3b8] group-focus-within:text-[#5c52d2] transition-colors">
                                <Lock className="h-5 w-5" />
                            </div>
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-11 pr-12 py-6 border-[#e2e8f0] border-2 rounded-2xl focus:border-[#5c52d2] focus:ring-0 transition-all text-[#2d2a4a] font-semibold placeholder:text-[#94a3b8]"
                                placeholder="Enter your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94a3b8] hover:text-[#5c52d2] transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white py-7 rounded-2xl font-black text-lg transition-all shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] active:scale-[0.98]"
                    >
                        {isLoading ? "Signing In..." : "Sign In"}
                    </Button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-sm font-bold text-[#64748b]">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#6366f1] hover:underline underline-offset-4">
                            Sign up here
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* Bottom Footer Info */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-12 text-center text-white/60 text-[10px] font-black tracking-widest uppercase border-t border-white/10 pt-6 w-full max-w-[450px]"
            >
                Secure Access • VidyāMitra Career Intelligence
            </motion.div>
        </div>
    );
}
