import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { PremiumBackground } from '../components/PremiumBackground';
import {
    FileText,
    Target,
    Zap,
    Trophy,
    TrendingUp,
    Calendar,
    ChevronRight,
    Play,
    CheckCircle2,
    Clock,
    User as UserIcon,
    Briefcase,
    Mic2,
    BookOpen,
    BrainCircuit,
    ArrowUpRight,
    Plus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const stats = [
        { label: 'Skills Assessed', val: '12', sub: '+3 this week', icon: Zap, color: 'blue' },
        { label: 'Achievements', val: '8', sub: 'New badge earned!', icon: Trophy, color: 'green' },
        { label: 'Profile Score', val: '85%', sub: '+5% this month', icon: TrendingUp, color: 'orange' },
        { label: 'Streak Days', val: '15', sub: 'Keep it up!', icon: Calendar, color: 'purple' }
    ];

    const quickActions = [
        { title: 'Start Career Journey', desc: 'Begin with resume analysis and career planning', icon: FileText, color: 'blue', path: '/resume-builder' },
        { title: 'Skill Evaluation', desc: 'Assess your skills vs job requirements', icon: BarChart2, color: 'green', path: '/evaluate' },
        { title: 'Learning Plan', desc: 'Get personalized training roadmap', icon: BookOpen, color: 'orange', path: '/career' },
        { title: 'Practice Quiz', desc: 'Test your knowledge with AI quizzes', icon: BrainCircuit, color: 'purple', path: '/quiz' }
    ];

    const recommendations = [
        {
            title: 'Complete Your Profile',
            desc: 'Add your work experience to get better job matches',
            progress: 75,
            action: 'Complete Now',
            color: 'blue'
        },
        {
            title: 'Take Skill Assessment',
            desc: 'Evaluate your JavaScript skills to unlock new opportunities',
            progress: 0,
            action: 'Start Assessment',
            color: 'green'
        },
        {
            title: 'Practice Interview',
            desc: 'Prepare for your next interview with AI-powered practice',
            progress: 25,
            action: 'Continue',
            color: 'purple'
        }
    ];

    return (
        <div className="min-h-screen font-sans pb-20 relative overflow-hidden animated-gradient">
            <PremiumBackground />

            <div className="relative z-10">
                <PremiumNavbar />

                <main className="max-w-[1400px] mx-auto px-6 pt-10">

                    {/* Welcome Banner - Glassmorphism */}
                    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-[1.5rem] sm:rounded-[2.5rem] p-6 sm:p-10 md:p-14 mb-10 text-white relative overflow-hidden shadow-2xl">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                            <div className="space-y-4 text-center md:text-left">
                                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-lg">
                                    Welcome back, {(user?.profile?.full_name || user?.full_name || user?.email?.split('@')[0] || 'User').split(' ')[0]}! 👋
                                </h1>
                                <p className="text-white/90 text-lg font-medium drop-shadow-md">Ready to advance your career today?</p>
                            </div>

                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => navigate('/profile')}
                                className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 flex items-center gap-5 w-full md:w-auto min-w-[300px] cursor-pointer hover:bg-white/20 transition-all shadow-lg"
                            >
                                <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center border border-white/10 overflow-hidden">
                                    {(user as any)?.profile?.profile_photo_url || localStorage.getItem(`user_profile_${user?.email}`) ? (
                                        <img
                                            src={(user as any)?.profile?.profile_photo_url || (localStorage.getItem(`user_profile_${user?.email}`) ? JSON.parse(localStorage.getItem(`user_profile_${user?.email}`)!).image : '')}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.currentTarget.style.display = 'none';
                                                e.currentTarget.parentElement!.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-white"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>';
                                            }}
                                        />
                                    ) : (
                                        <UserIcon className="w-8 h-8 text-white" />
                                    )}
                                </div>
                                <div>
                                    <h4 className="font-black text-xl leading-none mb-1">{user?.profile?.full_name || user?.full_name || 'User'}</h4>
                                    <p className="text-white/70 font-bold text-sm">{user?.email || 'user@example.com'}</p>
                                </div>
                            </motion.div>
                        </div>
                        {/* Decorative Background Elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/30 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/30 rounded-full -ml-24 -mb-24 blur-[60px]"></div>
                    </div>

                    <div className="space-y-12">
                        {/* Resume Progress Summary Card */}
                        <motion.div
                            whileHover={{ scale: 1.01 }}
                            onClick={() => navigate('/resume-builder')}
                            className="bg-white/90 backdrop-blur-sm border border-purple-100 shadow-xl hover:shadow-2xl transition-all rounded-[2rem] p-6 lg:p-8 cursor-pointer flex flex-col md:flex-row items-center gap-6 lg:gap-10 overflow-hidden relative group"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-2xl group-hover:bg-purple-500/10 transition-colors"></div>

                            <div className="w-16 h-16 bg-purple-100 text-[#5c52d2] rounded-2xl flex items-center justify-center flex-shrink-0">
                                <FileText className="w-8 h-8" />
                            </div>

                            <div className="flex-1 w-full space-y-2">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xl font-black text-gray-900 group-hover:text-[#5c52d2] transition-colors">
                                        Resume in Progress
                                    </h3>
                                    <span className="text-[#5c52d2] font-black">{Math.round((((user as any)?.profile?.resume_step) || ((user as any)?.profile?.resume_completion ? 8 : 1)) / 8 * 100)}%</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-[#5c52d2] to-[#7c3aed] h-full rounded-full transition-all duration-1000 ease-out"
                                        style={{ width: `${Math.round((((user as any)?.profile?.resume_step) || ((user as any)?.profile?.resume_completion ? 8 : 1)) / 8 * 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-sm font-bold text-gray-500 pt-1">
                                    Current Step: <span className="text-gray-700">
                                        {["Target Role", "Personal Info", "Education", "Experience", "Projects", "Skills", "ATS Check", "Final Polish"][Math.min((((user as any)?.profile?.resume_step) || ((user as any)?.profile?.resume_completion ? 8 : 1)) - 1, 7)]}
                                    </span>
                                </p>
                            </div>

                            <div className="hidden md:flex w-10 h-10 rounded-full bg-purple-50 items-center justify-center group-hover:bg-[#5c52d2] group-hover:text-white transition-colors">
                                <ChevronRight className="w-5 h-5 text-[#5c52d2] group-hover:text-white" />
                            </div>
                        </motion.div>

                        {/* Quick Actions */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4 ml-1 text-white">
                                <Zap className="w-6 h-6 text-yellow-300" />
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight drop-shadow-md">Quick Actions</h2>
                            </div>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                                {quickActions.map((action, i) => (
                                    <motion.div
                                        key={i}
                                        whileHover={{ y: -5 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                    >
                                        <Card
                                            onClick={() => navigate(action.path)}
                                            className="border-0 bg-white/90 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-all rounded-3xl p-6 group cursor-pointer h-full"
                                        >
                                            <div className="flex flex-col items-start gap-5 h-full">
                                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all shadow-inner ${action.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                                                    action.color === 'green' ? 'bg-green-50 text-green-600' :
                                                        action.color === 'orange' ? 'bg-orange-50 text-orange-600' :
                                                            'bg-purple-50 text-purple-600'
                                                    }`}>
                                                    <action.icon className="w-7 h-7" />
                                                </div>
                                                <div className="flex-1 w-full flex flex-col justify-between">
                                                    <div>
                                                        <div className="flex items-center justify-between mb-2">
                                                            <h4 className="font-extrabold text-gray-900 text-lg group-hover:text-[#5c52d2] transition-colors">{action.title}</h4>
                                                            <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#5c52d2] transition-colors" />
                                                        </div>
                                                        <p className="text-sm font-medium text-gray-500 leading-relaxed">{action.desc}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* More Actions */}
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-4 ml-1 text-white">
                                <Plus className="w-6 h-6 text-yellow-300" />
                                <h2 className="text-2xl font-black tracking-tight drop-shadow-md">More Actions</h2>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => navigate('/interview')}
                                    className="w-full bg-white/90 backdrop-blur-sm border-0 rounded-3xl p-6 flex justify-between items-center group shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                                            <Mic2 className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-black text-gray-900 text-lg group-hover:text-red-600 transition-colors">Mock Interview</span>
                                            <span className="text-sm text-gray-500 font-medium">Practice with AI</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-red-500 group-hover:text-white transition-all">
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                    </div>
                                </motion.button>

                                <motion.button
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => navigate('/jobs')}
                                    className="w-full bg-white/90 backdrop-blur-sm border-0 rounded-3xl p-6 flex justify-between items-center group shadow-lg hover:shadow-xl transition-all"
                                >
                                    <div className="flex items-center gap-5">
                                        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                            <Briefcase className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <span className="block font-black text-gray-900 text-lg group-hover:text-blue-600 transition-colors">Job Matching</span>
                                            <span className="text-sm text-gray-500 font-medium">Find your fit</span>
                                        </div>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-blue-500 group-hover:text-white transition-all">
                                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                    </div>
                                </motion.button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

// Missing Lucide component
const BarChart2 = (props: any) => (
    <svg
        {...props}
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
);
