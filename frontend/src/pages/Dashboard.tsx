import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { PremiumNavbar } from '../components/PremiumNavbar';
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
        { title: 'Learning Plan', desc: 'Get personalized training roadmap', icon: BookOpen, color: 'orange', path: '/learning' },
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
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
            <PremiumNavbar />

            <main className="max-w-[1400px] mx-auto px-6 pt-10">

                {/* Welcome Banner */}
                <div className="bg-[#5c52d2] rounded-[2.5rem] p-10 md:p-14 mb-10 text-white relative overflow-hidden shadow-2xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 relative z-10">
                        <div className="space-y-4">
                            <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                                Welcome back, {user?.full_name?.split(' ')[0] || 'John'}! 👋
                            </h1>
                            <p className="text-white/80 text-lg font-medium">Ready to advance your career today?</p>
                        </div>

                        <div
                            onClick={() => navigate('/profile')}
                            className="bg-white/10 backdrop-blur-md rounded-3xl p-6 border border-white/20 flex items-center gap-5 w-full md:w-auto min-w-[300px] cursor-pointer hover:bg-white/20 transition-all"
                        >
                            <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                                <UserIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h4 className="font-black text-xl leading-none mb-1">{user?.full_name || 'John Doe'}</h4>
                                <p className="text-white/60 font-bold text-sm">{user?.email || 'john@gmail.com'}</p>
                            </div>
                        </div>
                    </div>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24 blur-[60px]"></div>
                </div>

                {/* Stats Grid */}


                <div className="space-y-10">
                    {/* Quick Actions */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4 ml-1">
                            <Zap className="w-5 h-5 text-[#5c52d2]" />
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">Quick Actions</h2>
                        </div>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {quickActions.map((action, i) => (
                                <Card
                                    key={i}
                                    onClick={() => navigate(action.path)}
                                    className="border border-gray-100 shadow-sm hover:shadow-md transition-all rounded-3xl bg-white p-6 group cursor-pointer"
                                >
                                    <div className="flex flex-col items-start gap-5">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${action.color === 'blue' ? 'bg-blue-50 text-blue-500' :
                                            action.color === 'green' ? 'bg-green-50 text-green-500' :
                                                action.color === 'orange' ? 'bg-orange-50 text-orange-500' :
                                                    'bg-purple-50 text-purple-500'
                                            }`}>
                                            <action.icon className="w-6 h-6" />
                                        </div>
                                        <div className="flex-1 w-full">
                                            <div className="flex items-center justify-between mb-2">
                                                <h4 className="font-black text-gray-900 text-lg">{action.title}</h4>
                                                <ArrowUpRight className="w-4 h-4 text-gray-300 group-hover:text-[#5c52d2] transition-colors" />
                                            </div>
                                            <p className="text-sm font-medium text-gray-400 leading-snug">{action.desc}</p>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>



                    {/* More Actions */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 mb-4 ml-1">
                            <Plus className="w-5 h-5 text-[#5c52d2]" />
                            <h2 className="text-2xl font-black text-gray-900 tracking-tight">More Actions</h2>
                        </div>
                        <div className="grid md:grid-cols-2 gap-6">
                            <button
                                onClick={() => navigate('/interview')}
                                className="w-full bg-white border border-gray-100 rounded-2xl p-6 flex justify-between items-center group hover:bg-[#5c52d2] transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-red-50 text-red-500 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                                        <Mic2 className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-gray-900 group-hover:text-white transition-colors">Mock Interview</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                            </button>

                            <button
                                onClick={() => navigate('/jobs')}
                                className="w-full bg-white border border-gray-100 rounded-2xl p-6 flex justify-between items-center group hover:bg-[#5c52d2] transition-all shadow-sm"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-colors">
                                        <Briefcase className="w-5 h-5" />
                                    </div>
                                    <span className="font-black text-gray-900 group-hover:text-white transition-colors">Job Matching</span>
                                </div>
                                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-white transition-all transform group-hover:translate-x-1" />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
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
