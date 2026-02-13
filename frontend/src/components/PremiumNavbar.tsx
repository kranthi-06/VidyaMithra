import { useAuth } from '../context/AuthContext';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'react-router-dom';
import {
    LogOut,
    LayoutDashboard,
    FileText,
    Target,
    BookOpen,
    BrainCircuit,
    Mic2,
    Briefcase,
    LineChart,
    GraduationCap
} from 'lucide-react';

export const PremiumNavbar = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    const navItems = [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'Resume', path: '/resume-builder', icon: FileText },
        { label: 'Evaluate', path: '/evaluate', icon: Target },
        { label: 'Plan', path: '/learning', icon: BookOpen },
        { label: 'Quiz', path: '/quiz', icon: BrainCircuit },
        { label: 'Interview', path: '/interview', icon: Mic2 },
        { label: 'Jobs', path: '/jobs', icon: Briefcase },
        { label: 'Progress', path: '/progress', icon: LineChart },
    ];

    return (
        <nav className="bg-[#5c52d2] border-b border-white/10 sticky top-0 z-50 py-1">
            <div className="max-w-[1600px] mx-auto px-6">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center gap-8">
                        <Link to="/dashboard" className="flex items-center space-x-3 group mr-4">
                            <div className="w-9 h-9 bg-white text-[#5c52d2] rounded-xl flex items-center justify-center transform group-hover:rotate-12 transition-transform shadow-lg">
                                <GraduationCap className="w-6 h-6" />
                            </div>
                            <span className="text-xl font-black text-white tracking-tighter">VidyāMitra</span>
                        </Link>

                        <div className="hidden lg:flex items-center space-x-1">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.label}
                                        to={item.path}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-xs uppercase tracking-wider group ${isActive
                                            ? 'bg-white/20 text-white shadow-inner border border-white/20'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`}
                                    >
                                        <item.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`} />
                                        {item.label}
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 font-bold text-xs uppercase tracking-wider transition-all"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};
