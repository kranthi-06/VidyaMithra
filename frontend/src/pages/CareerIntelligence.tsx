import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumNavbar } from '../components/PremiumNavbar';
import {
    Target,
    TrendingUp,
    Map,
    Search,
    Code,
    DollarSign,
    Megaphone,
    Building2,
    Grid,
    ArrowRight,
    ChevronRight,
    Sparkles,
    Users,
    Laptop,
    Briefcase
} from 'lucide-react';

type Step = 'domains' | 'roles' | 'analysis';

const domains = [
    {
        id: 'it',
        title: 'Information Technology',
        icon: Code,
        color: 'text-blue-500',
        bgColor: 'bg-blue-50',
        desc: 'Software development, cybersecurity, data science, and tech innovation',
        roles: ['Software Engineer', 'Data Scientist', 'DevOps Engineer', 'Product Manager']
    },
    {
        id: 'finance',
        title: 'Finance & Banking',
        icon: DollarSign,
        color: 'text-green-500',
        bgColor: 'bg-green-50',
        desc: 'Financial analysis, investment banking, accounting, and fintech',
        roles: ['Financial Analyst', 'Investment Banker', 'Risk Manager', 'Accountant']
    },
    {
        id: 'sales',
        title: 'Sales & Marketing',
        icon: Megaphone,
        color: 'text-rose-500',
        bgColor: 'bg-rose-50',
        desc: 'Business development, digital marketing, customer relations, and growth',
        roles: ['Sales Manager', 'Marketing Specialist', 'Business Developer', 'Account Executive']
    },
    {
        id: 'govt',
        title: 'Government & Public Sector',
        icon: Building2,
        color: 'text-purple-500',
        bgColor: 'bg-purple-50',
        desc: 'Public administration, policy making, civil services, and governance',
        roles: ['Civil Servant', 'Policy Analyst', 'Public Administrator', 'Government Consultant']
    },
    {
        id: 'other',
        title: 'Other Industries',
        icon: Grid,
        color: 'text-orange-500',
        bgColor: 'bg-orange-50',
        desc: 'Healthcare, education, manufacturing, consulting, and more',
        roles: ['Healthcare Professional', 'Teacher', 'Consultant', 'Operations Manager']
    }
];

const jobRoles = [
    {
        id: 'se',
        title: 'Software Engineer',
        demand: 'High Demand',
        desc: 'Design, develop, and maintain software applications and systems',
        exp: '2-5 years',
        salary: '$75,000 - $120,000',
        skills: ['JavaScript', 'Python', 'React', 'Node.js'],
        icon: Code
    },
    {
        id: 'ds',
        title: 'Data Scientist',
        demand: 'High Demand',
        desc: 'Analyze complex data to help organizations make informed decisions',
        exp: '3-6 years',
        salary: '$85,000 - $140,000',
        skills: ['Python', 'R', 'Machine Learning', 'SQL'],
        icon: Code // Using Code as placeholder for Data icon
    },
    {
        id: 'devops',
        title: 'DevOps Engineer',
        demand: 'High Demand',
        desc: 'Manage infrastructure, deployment pipelines, and system reliability',
        exp: '3-7 years',
        salary: '$80,000 - $130,000',
        skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD'],
        icon: Code
    },
    {
        id: 'pm',
        title: 'Product Manager',
        demand: 'Medium Demand',
        desc: 'Define product strategy and coordinate development teams',
        exp: '4-8 years',
        salary: '$90,000 - $150,000',
        skills: ['Product Strategy', 'Agile', 'Analytics', 'User Research'],
        icon: Briefcase
    }
];

export default function CareerIntelligence() {
    const [step, setStep] = useState<Step>('domains');
    const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');

    const filteredRoles = jobRoles.filter(role =>
        role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
            <PremiumNavbar />

            <main className="max-w-7xl mx-auto px-6 pt-16">
                <AnimatePresence mode="wait">
                    {step === 'domains' && (
                        <motion.div
                            key="domains"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                    <Target className="w-8 h-8 text-rose-500" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">Select Your Domain of Interest</h1>
                                    <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                                        Choose the industry domain that aligns with your career goals. This helps us provide more targeted job matching and skill recommendations.
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {domains.map((domain) => (
                                    <Card
                                        key={domain.id}
                                        onClick={() => {
                                            setSelectedDomain(domain.id);
                                            setStep('roles');
                                        }}
                                        className="group p-8 border-none shadow-sm hover:shadow-xl hover:shadow-indigo-100 transition-all cursor-pointer rounded-[2.5rem] bg-white space-y-6"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 ${domain.bgColor} ${domain.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                                                <domain.icon className="w-6 h-6" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900">{domain.title}</h3>
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm leading-relaxed">
                                            {domain.desc}
                                        </p>
                                        <div className="space-y-4 pt-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Popular Roles:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {domain.roles.map((role) => (
                                                    <span key={role} className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-[10px] font-black group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                                                        {role}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {step === 'roles' && (
                        <motion.div
                            key="roles"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            <div className="text-center space-y-6">
                                <div className="w-16 h-16 bg-rose-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                    <Target className="w-8 h-8 text-rose-500" />
                                </div>
                                <div className="space-y-2">
                                    <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">Select Your Desired Job Role</h1>
                                    <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                                        Choose the specific role you're targeting. We'll analyze your eligibility and create a personalized plan to help you achieve your career goals.
                                    </p>
                                </div>
                            </div>

                            <div className="max-w-2xl mx-auto relative">
                                <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search job roles, skills, or keywords..."
                                    className="h-16 pl-14 pr-6 rounded-[1.25rem] border-slate-100 bg-white shadow-sm focus:ring-rose-500/20 focus:border-rose-500/50 font-medium"
                                />
                            </div>

                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {filteredRoles.map((role) => (
                                    <Card
                                        key={role.id}
                                        onClick={() => {
                                            setSelectedRole(role.id);
                                            // Handle final selection - maybe navigate to a dashboard or assessment
                                            window.location.href = '/dashboard';
                                        }}
                                        className="group p-8 border-none shadow-sm hover:shadow-xl hover:shadow-rose-100 transition-all cursor-pointer rounded-[2.5rem] bg-white space-y-6"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center group-hover:bg-rose-50 group-hover:text-rose-500 transition-all">
                                                    <role.icon className="w-5 h-5" />
                                                </div>
                                                <h3 className="text-lg font-black text-slate-900">{role.title}</h3>
                                            </div>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${role.demand === 'High Demand' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                                }`}>
                                                {role.demand}
                                            </span>
                                        </div>
                                        <p className="text-slate-400 font-bold text-sm leading-relaxed line-clamp-2">
                                            {role.desc}
                                        </p>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-8 text-[11px] font-black text-slate-400">
                                                <div className="flex items-center gap-2">
                                                    <ChevronRight className="w-4 h-4 text-blue-400" />
                                                    {role.exp}
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <DollarSign className="w-4 h-4 text-green-400" />
                                                    {role.salary}
                                                </div>
                                            </div>
                                            <div className="space-y-3">
                                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">Key Skills Required:</p>
                                                <div className="flex flex-wrap gap-2">
                                                    {role.skills.map((skill) => (
                                                        <span key={skill} className="px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-black">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                    <span className="text-[10px] font-black text-slate-300 ml-1">+2 more</span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
