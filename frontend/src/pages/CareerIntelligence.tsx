import { useState, useEffect } from 'react';
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
    Briefcase,
    Lock,
    Unlock,
    CheckCircle2,
    BookOpen,
    Play,
    Loader2,
    ExternalLink
} from 'lucide-react';
import {
    generateRoadmap,
    getActiveRoadmap,
    getLearningResources
} from '../services/careerPlatform';

type Step = 'domains' | 'roles' | 'analysis' | 'roadmap';

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
        icon: Code
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

    // ── New: Roadmap state ──────────────────────
    const [roadmapData, setRoadmapData] = useState<any>(null);
    const [roadmapId, setRoadmapId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [learningResources, setLearningResources] = useState<any[]>([]);
    const [selectedSkillForLearn, setSelectedSkillForLearn] = useState<any>(null);
    const [loadingResources, setLoadingResources] = useState(false);

    // Check for existing roadmap on mount
    useEffect(() => {
        const checkExistingRoadmap = async () => {
            try {
                const res = await getActiveRoadmap();
                if (res.roadmap) {
                    setRoadmapData(res.roadmap.roadmap_data);
                    setRoadmapId(res.roadmap.id);
                    setSelectedRole(res.roadmap.target_role);
                    setStep('roadmap');
                }
            } catch (e) {
                // No roadmap yet - stay on domains step
            }
        };
        checkExistingRoadmap();
    }, []);

    const filteredRoles = jobRoles.filter(role =>
        role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        role.skills.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    // Generate roadmap when role is selected
    const handleRoleSelect = async (roleTitle: string) => {
        setSelectedRole(roleTitle);
        setIsGenerating(true);
        setStep('roadmap');

        try {
            const role = jobRoles.find(r => r.title === roleTitle);
            const res = await generateRoadmap(
                roleTitle,
                role?.skills || [],
                []
            );
            setRoadmapData(res.roadmap_data);
            setRoadmapId(res.id);
        } catch (error) {
            console.error('Failed to generate roadmap:', error);
            // Fallback: redirect to dashboard
            window.location.href = '/dashboard';
        } finally {
            setIsGenerating(false);
        }
    };

    // Fetch learning resources for a skill
    const handleLearnSkill = async (skill: any, levelName: string) => {
        setSelectedSkillForLearn(skill);
        setLoadingResources(true);
        try {
            const res = await getLearningResources(skill.name, levelName);
            setLearningResources(res.resources || []);
        } catch (e) {
            setLearningResources([]);
        } finally {
            setLoadingResources(false);
        }
    };

    // Navigate to quiz for a skill
    const handleTakeQuiz = (skill: any, levelName: string) => {
        window.location.href = `/quiz?skill_id=${skill.id}&skill_name=${encodeURIComponent(skill.name)}&level=${levelName}&roadmap_id=${roadmapId}`;
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
            case 'unlocked': return <Unlock className="w-5 h-5 text-[#5c52d2]" />;
            case 'locked': return <Lock className="w-5 h-5 text-slate-300" />;
            default: return <Lock className="w-5 h-5 text-slate-300" />;
        }
    };

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'completed': return 'border-emerald-200 bg-emerald-50/50';
            case 'unlocked': return 'border-purple-200 bg-white hover:shadow-xl hover:shadow-purple-100/50 cursor-pointer';
            case 'locked': return 'border-slate-100 bg-slate-50/30 opacity-60';
            default: return 'border-slate-100 bg-slate-50/30 opacity-60';
        }
    };

    const getLevelColor = (name: string) => {
        switch (name) {
            case 'Beginner': return { text: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', accent: 'from-blue-500 to-cyan-500' };
            case 'Intermediate': return { text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200', accent: 'from-orange-500 to-amber-500' };
            case 'Advanced': return { text: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-200', accent: 'from-rose-500 to-pink-500' };
            default: return { text: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-200', accent: 'from-slate-500 to-gray-500' };
        }
    };

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
                                        Choose the specific role you're targeting. We'll generate a personalized AI roadmap to help you achieve your career goals.
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
                                        onClick={() => handleRoleSelect(role.title)}
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

                    {/* ── NEW: Roadmap View ───────────────────── */}
                    {step === 'roadmap' && (
                        <motion.div
                            key="roadmap"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            {isGenerating ? (
                                <div className="text-center py-32 space-y-8">
                                    <div className="w-24 h-24 bg-white shadow-xl rounded-[3rem] flex items-center justify-center mx-auto ring-8 ring-purple-50">
                                        <Loader2 className="w-12 h-12 text-[#5c52d2] animate-spin" />
                                    </div>
                                    <h2 className="text-4xl font-black text-slate-900 tracking-tight">Generating Your AI Roadmap...</h2>
                                    <p className="text-lg font-medium text-slate-400 max-w-xl mx-auto">
                                        Our AI is creating a personalized learning path for <span className="text-[#5c52d2] font-black">{selectedRole}</span>. This may take a moment.
                                    </p>
                                </div>
                            ) : roadmapData ? (
                                <>
                                    <div className="text-center space-y-6">
                                        <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto shadow-sm">
                                            <Map className="w-8 h-8 text-[#5c52d2]" />
                                        </div>
                                        <div className="space-y-2">
                                            <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">Your AI Learning Roadmap</h1>
                                            <p className="text-slate-400 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                                                Personalized path to become a <span className="text-[#5c52d2] font-black">{selectedRole}</span>. Complete skills, pass quizzes, and unlock the next level.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => { setStep('domains'); setRoadmapData(null); setRoadmapId(null); }}
                                            variant="outline"
                                            className="h-12 px-8 rounded-xl border-slate-200 font-black text-slate-500 text-xs uppercase tracking-widest"
                                        >
                                            Change Target Role
                                        </Button>
                                    </div>

                                    {/* Roadmap Levels */}
                                    <div className="space-y-16">
                                        {roadmapData.levels?.map((level: any, levelIdx: number) => {
                                            const colors = getLevelColor(level.name);
                                            const completedCount = level.skills?.filter((s: any) => s.status === 'completed').length || 0;
                                            const totalCount = level.skills?.length || 0;
                                            const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

                                            return (
                                                <div key={levelIdx} className="space-y-6">
                                                    {/* Level Header */}
                                                    <div className="flex items-center gap-4">
                                                        <div className={`px-6 py-2 rounded-xl bg-gradient-to-r ${colors.accent} text-white text-sm font-black uppercase tracking-widest shadow-lg`}>
                                                            Level {levelIdx + 1}
                                                        </div>
                                                        <h2 className="text-2xl font-[900] text-slate-900 tracking-tight">{level.name}</h2>
                                                        <span className={`ml-auto px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${colors.bg} ${colors.text}`}>
                                                            {completedCount}/{totalCount} completed
                                                        </span>
                                                    </div>
                                                    {/* Level Progress Bar */}
                                                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${progressPct}%` }}
                                                            className={`h-full bg-gradient-to-r ${colors.accent} rounded-full`}
                                                        />
                                                    </div>
                                                    {/* Skill Grid */}
                                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                                        {level.skills?.map((skill: any, skillIdx: number) => (
                                                            <Card
                                                                key={skill.id}
                                                                className={`p-6 rounded-[2rem] border-2 transition-all ${getStatusStyle(skill.status)}`}
                                                            >
                                                                <div className="space-y-4">
                                                                    <div className="flex items-start justify-between">
                                                                        <div className="flex items-center gap-3">
                                                                            {getStatusIcon(skill.status)}
                                                                            <h4 className="font-black text-slate-900 text-sm leading-tight">{skill.name}</h4>
                                                                        </div>
                                                                        <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest whitespace-nowrap">
                                                                            ~{skill.estimated_hours}h
                                                                        </span>
                                                                    </div>
                                                                    <p className="text-slate-400 text-xs font-medium leading-relaxed">{skill.description}</p>

                                                                    {skill.status === 'unlocked' && (
                                                                        <div className="flex gap-2 pt-2">
                                                                            <Button
                                                                                onClick={() => handleLearnSkill(skill, level.name)}
                                                                                className="flex-1 h-10 rounded-xl bg-slate-100 text-slate-600 font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 shadow-none"
                                                                            >
                                                                                <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Learn
                                                                            </Button>
                                                                            <Button
                                                                                onClick={() => handleTakeQuiz(skill, level.name)}
                                                                                className="flex-1 h-10 rounded-xl bg-gradient-to-r from-[#5c52d2] to-[#7c3aed] text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-purple-100"
                                                                            >
                                                                                <Play className="w-3.5 h-3.5 mr-1.5" /> Take Quiz
                                                                            </Button>
                                                                        </div>
                                                                    )}
                                                                    {skill.status === 'completed' && (
                                                                        <div className="text-center pt-2">
                                                                            <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">✓ Skill Mastered</span>
                                                                        </div>
                                                                    )}
                                                                    {skill.status === 'locked' && (
                                                                        <div className="text-center pt-2">
                                                                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Complete prerequisites to unlock</span>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Card>
                                                        ))}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Learning Resources Modal */}
                                    {selectedSkillForLearn && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-6"
                                        >
                                            <Card className="p-8 rounded-[2.5rem] border-none shadow-xl bg-white/90 backdrop-blur-sm border border-white/20">
                                                <div className="flex items-center justify-between mb-6">
                                                    <div className="flex items-center gap-3">
                                                        <BookOpen className="w-6 h-6 text-[#5c52d2]" />
                                                        <h3 className="text-xl font-[900] text-slate-900">Learn: {selectedSkillForLearn.name}</h3>
                                                    </div>
                                                    <button onClick={() => { setSelectedSkillForLearn(null); setLearningResources([]); }} className="text-slate-400 hover:text-slate-600 font-black text-sm">✕ Close</button>
                                                </div>
                                                {loadingResources ? (
                                                    <div className="text-center py-12">
                                                        <Loader2 className="w-8 h-8 text-[#5c52d2] animate-spin mx-auto mb-4" />
                                                        <p className="text-slate-400 font-bold">Fetching real YouTube videos...</p>
                                                    </div>
                                                ) : learningResources.length > 0 ? (
                                                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                                        {learningResources.map((res: any, idx: number) => (
                                                            <a
                                                                key={idx}
                                                                href={res.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="group rounded-2xl overflow-hidden border-2 border-slate-100 hover:border-purple-300 hover:shadow-xl transition-all block bg-white"
                                                            >
                                                                {/* Thumbnail */}
                                                                <div className="relative w-full aspect-video bg-slate-100 overflow-hidden">
                                                                    {res.thumbnail ? (
                                                                        <img
                                                                            src={res.thumbnail}
                                                                            alt={res.title}
                                                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                                        />
                                                                    ) : (
                                                                        <div className="w-full h-full flex items-center justify-center bg-slate-200">
                                                                            <Play className="w-10 h-10 text-slate-400" />
                                                                        </div>
                                                                    )}
                                                                    {/* YouTube Play Overlay */}
                                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                                                        <div className="w-14 h-14 bg-red-600 rounded-full flex items-center justify-center shadow-xl">
                                                                            <Play className="w-6 h-6 text-white ml-0.5" />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                {/* Info */}
                                                                <div className="p-4 space-y-1.5">
                                                                    <h4 className="font-black text-slate-900 text-sm leading-tight line-clamp-2 group-hover:text-[#5c52d2] transition-colors">{res.title}</h4>
                                                                    <p className="text-[11px] font-bold text-slate-400 truncate">{res.channel}</p>
                                                                </div>
                                                            </a>
                                                        ))}
                                                    </div>
                                                ) : (
                                                    <div className="text-center py-10">
                                                        <p className="text-slate-400 font-bold text-lg">No videos available right now</p>
                                                        <p className="text-slate-300 text-sm mt-1">Try again later or search YouTube directly.</p>
                                                    </div>
                                                )}
                                            </Card>
                                        </motion.div>
                                    )}
                                </>
                            ) : null}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
}
