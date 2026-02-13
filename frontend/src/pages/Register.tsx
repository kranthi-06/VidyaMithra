import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Lock, Eye, EyeOff, Rocket, ArrowLeft } from 'lucide-react';

export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { register } = useAuth();
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
        if (password !== confirmPassword) {
            showToast('Passwords do not match', 'error');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await register({
                email,
                password,
                full_name: `${firstName} ${lastName}`
            });
            showToast('Identity created! Logging you in...', 'success');
            setTimeout(() => navigate('/dashboard'), 1500);
        } catch (err: any) {
            setError(err.response?.data?.detail || 'Registration failed. Try again.');
            showToast('Onboarding failed.', 'error');
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[550px] bg-white rounded-[2.5rem] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-10 relative overflow-hidden my-8"
            >
                {/* Decorative purple bar at the bottom */}
                <div className="absolute bottom-0 left-0 right-0 h-2 bg-[#5c52d2]"></div>

                <div className="flex flex-col items-center text-center space-y-4 mb-8">
                    <motion.div
                        animate={{ y: [0, -10, 0] }}
                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                        className="w-16 h-16 bg-[#2d2a4a] text-[#ffd700] rounded-2xl flex items-center justify-center rotate-12 shadow-lg mb-2"
                    >
                        <Rocket className="w-10 h-10 -rotate-12 fill-[#ffd700]" />
                    </motion.div>

                    <div className="space-y-1">
                        <h1 className="text-4xl font-black text-[#2d2a4a] tracking-tight">Join VidyāMitra</h1>
                        <p className="text-[10px] font-black text-[#7c83fd] tracking-[0.3em] uppercase">Start Your Career Journey</p>
                    </div>

                    <p className="text-[#64748b] font-medium leading-relaxed flex items-center gap-2">
                        Create your account to unlock your potential 💡
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="firstName" className="text-xs font-bold text-[#2d2a4a] ml-1">First Name</Label>
                            <Input
                                id="firstName"
                                required
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="block w-full px-4 py-5 border-[#e2e8f0] border-2 rounded-xl focus:border-[#5c52d2] focus:ring-0 transition-all text-[#2d2a4a] font-semibold placeholder:text-[#94a3b8]"
                                placeholder="John"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="lastName" className="text-xs font-bold text-[#2d2a4a] ml-1">Last Name</Label>
                            <Input
                                id="lastName"
                                required
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="block w-full px-4 py-5 border-[#e2e8f0] border-2 rounded-xl focus:border-[#5c52d2] focus:ring-0 transition-all text-[#2d2a4a] font-semibold placeholder:text-[#94a3b8]"
                                placeholder="Doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="username" className="text-xs font-bold text-[#2d2a4a] ml-1">Username</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94a3b8] group-focus-within:text-[#5c52d2] transition-colors">
                                <User className="h-4 w-4" />
                            </div>
                            <Input
                                type="text"
                                id="username"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="block w-full pl-10 pr-4 py-5 border-[#e2e8f0] border-2 rounded-xl focus:border-[#5c52d2] focus:ring-0 transition-all text-[#2d2a4a] font-semibold placeholder:text-[#94a3b8]"
                                placeholder="john_doe"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-[#2d2a4a] ml-1">Email</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94a3b8] group-focus-within:text-[#5c52d2] transition-colors">
                                <Mail className="h-4 w-4" />
                            </div>
                            <Input
                                type="email"
                                id="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full pl-10 pr-4 py-5 border-[#e2e8f0] border-2 rounded-xl focus:border-[#5c52d2] focus:ring-0 transition-all text-[#2d2a4a] font-semibold placeholder:text-[#94a3b8]"
                                placeholder="john@example.com"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" title="Password" className="text-xs font-bold text-[#2d2a4a] ml-1">Password</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94a3b8] group-focus-within:text-[#5c52d2] transition-colors">
                                <Lock className="h-4 w-4" />
                            </div>
                            <Input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full pl-10 pr-12 py-5 border-[#e2e8f0] border-2 rounded-xl focus:border-[#5c52d2] focus:ring-0 transition-all text-[#2d2a4a] font-semibold placeholder:text-[#94a3b8]"
                                placeholder="At least 8 characters"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94a3b8] hover:text-[#5c52d2] transition-colors"
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="confirmPassword" title="Confirm Password" className="text-xs font-bold text-[#2d2a4a] ml-1">Confirm Password</Label>
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-[#94a3b8] group-focus-within:text-[#5c52d2] transition-colors">
                                <Lock className="h-4 w-4" />
                            </div>
                            <Input
                                type={showConfirmPassword ? "text" : "password"}
                                id="confirmPassword"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="block w-full pl-10 pr-12 py-5 border-[#e2e8f0] border-2 rounded-xl focus:border-[#5c52d2] focus:ring-0 transition-all text-[#2d2a4a] font-semibold placeholder:text-[#94a3b8]"
                                placeholder="Confirm your password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#94a3b8] hover:text-[#5c52d2] transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] hover:from-[#4f46e5] hover:to-[#7c3aed] text-white py-7 rounded-2xl font-black text-lg transition-all shadow-[0_10px_20px_-5px_rgba(99,102,241,0.4)] active:scale-[0.98]"
                    >
                        {isLoading ? "Creating Account..." : "🚀 Create Account"}
                    </Button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-sm font-bold text-[#64748b]">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#6366f1] hover:underline underline-offset-4">
                            Sign in here
                        </Link>
                    </p>
                </div>
            </motion.div>

            {/* Footnote */}
            <div className="text-center pb-8 sticky bottom-0">
                <Link to="/" className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-all font-black uppercase text-xs tracking-[0.3em] group">
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-2 transition-transform" />
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
