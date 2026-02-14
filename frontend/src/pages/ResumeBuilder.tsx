import { useState } from 'react';
import { analyzeResume } from '../services/resume';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';
import { PremiumNavbar } from '../components/PremiumNavbar';
import {
    FileText,
    Upload,
    CheckCircle2,
    XCircle,
    AlertCircle,
    TrendingUp,
    Briefcase,
    Zap,
    ArrowLeft,
    ShieldCheck,
    Lightbulb,
    User,
    GraduationCap,
    Laptop,
    Wrench,
    Sparkles,
    Download,
    ArrowRight,
    PlusCircle
} from 'lucide-react';
import { PremiumBackground } from '../components/PremiumBackground';

type Step = 'selection' | 'upload' | 'builder' | 'analysis' | 'templates';
type BuilderStep = 1 | 2 | 3 | 4 | 5 | 6;

export default function ResumeBuilder() {
    const [step, setStep] = useState<Step>('selection');
    const [builderStep, setBuilderStep] = useState<BuilderStep>(1);
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);
    const [analysis, setAnalysis] = useState<any>(null);
    const [error, setError] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState('modern');
    const [selectedTheme, setSelectedTheme] = useState('indigo');
    const [showPreview, setShowPreview] = useState<string | null>(null);

    // Builder Form State
    const [formData, setFormData] = useState({
        personal: { first: '', last: '', email: '', phone: '', location: '', summary: '' },
        education: [{ degree: '', institution: '', year: '', gpa: '' }],
        experience: [{ role: '', company: '', period: '', desc: '' }],
        projects: [{ name: '', tech: '', desc: '' }],
        skills: ''
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);
        setError('');
        try {
            const result = await analyzeResume(file);
            const parsedAnalysis = typeof result.analysis === 'string' ? JSON.parse(result.analysis) : result.analysis;
            setAnalysis(parsedAnalysis);
            setStep('analysis');
        } catch (err) {
            setError('Failed to analyze resume. Please confirm it is a valid PDF and try again.');
        } finally {
            setLoading(false);
        }
    };

    const resetFlow = () => {
        setStep('selection');
        setBuilderStep(1);
        setFile(null);
        setAnalysis(null);
        setError('');
    };

    const Stepper = () => {
        const steps = [
            { id: 1, label: 'Personal Info' },
            { id: 2, label: 'Education' },
            { id: 3, label: 'Experience' },
            { id: 4, label: 'Projects' },
            { id: 5, label: 'Skills' },
            { id: 6, label: 'Generate' }
        ];

        return (
            <div className="flex items-center justify-between mb-16 max-w-4xl mx-auto overflow-x-auto pb-4 px-4 sm:px-0">
                {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center group">
                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm transition-all shadow-sm ${builderStep === s.id
                                ? 'bg-[#5c52d2] text-white ring-4 ring-purple-100'
                                : builderStep > s.id
                                    ? 'bg-green-500 text-white'
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                {builderStep > s.id ? <CheckCircle2 className="w-5 h-5" /> : s.id}
                            </div>
                            <span className={`text-[10px] font-black uppercase tracking-widest whitespace-nowrap ${builderStep === s.id ? 'text-[#5c52d2]' : 'text-gray-400'
                                }`}>{s.label}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`w-12 sm:w-20 h-0.5 mx-4 mt-[-18px] transition-colors ${builderStep > s.id ? 'bg-green-500' : 'bg-gray-100'
                                }`} />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen font-sans pb-20 relative overflow-hidden animated-gradient">
            <PremiumBackground />
            <div className="relative z-10">
                <PremiumNavbar />

                <main className="max-w-[1200px] mx-auto px-6 pt-10">
                    <AnimatePresence mode="wait">
                        {step === 'selection' && (
                            <motion.div
                                key="selection"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-3xl mx-auto text-center space-y-12 py-10"
                            >
                                <div className="space-y-6">
                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner border border-white/20">
                                        <FileText className="w-10 h-10 text-white" />
                                    </div>
                                    <h1 className="text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">
                                        Let's Start Your Career Journey!
                                    </h1>
                                    <p className="text-blue-100 text-lg font-medium max-w-xl mx-auto drop-shadow-sm">
                                        To provide you with the best career guidance, we need to understand your current profile.
                                    </p>
                                </div>

                                <div className="space-y-8">
                                    <h2 className="text-2xl font-black text-gray-800 tracking-tight">Do you have an existing resume?</h2>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <button
                                            onClick={() => setStep('upload')}
                                            className="bg-white/90 backdrop-blur-sm p-10 rounded-[3rem] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all border-2 border-transparent hover:border-white/50 group text-center space-y-6"
                                        >
                                            <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto text-green-500 group-hover:scale-110 transition-transform">
                                                <CheckCircle2 className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black text-gray-900">Yes, I have one</h3>
                                                <p className="text-gray-500 font-medium text-sm px-4">Upload your existing resume for analysis</p>
                                            </div>
                                        </button>

                                        <button
                                            onClick={() => setStep('builder')}
                                            className="bg-white/90 backdrop-blur-sm p-10 rounded-[3rem] shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all border-2 border-transparent hover:border-white/50 group text-center space-y-6"
                                        >
                                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto text-red-400 group-hover:scale-110 transition-transform">
                                                <XCircle className="w-8 h-8" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-2xl font-black text-gray-900">No, I need help</h3>
                                                <p className="text-gray-400 font-medium text-sm px-4">Let our AI help you build a professional resume</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 'builder' && (
                            <motion.div
                                key="builder"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                className="max-w-4xl mx-auto py-10"
                            >
                                <Stepper />

                                <Card className="border-none shadow-2xl bg-white/90 backdrop-blur-sm rounded-[3rem] p-12">
                                    <AnimatePresence mode="wait">
                                        {builderStep === 1 && (
                                            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-[#5c52d2]">
                                                        <User className="w-6 h-6" />
                                                    </div>
                                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Personal Information</h2>
                                                </div>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase text-gray-400 ml-1">First Name</Label>
                                                        <Input placeholder="John" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-purple-200 transition-all font-bold px-6" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase text-gray-400 ml-1">Last Name</Label>
                                                        <Input placeholder="Doe" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-purple-200 transition-all font-bold px-6" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase text-gray-400 ml-1">Email</Label>
                                                        <Input type="email" placeholder="john.doe@email.com" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-purple-200 transition-all font-bold px-6" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase text-gray-400 ml-1">Phone</Label>
                                                        <Input placeholder="+1 (555) 123-4567" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-purple-200 transition-all font-bold px-6" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase text-gray-400 ml-1">Location</Label>
                                                    <Input placeholder="City, State, Country" className="h-14 rounded-2xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-purple-200 transition-all font-bold px-6" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase text-gray-400 ml-1">Professional Summary</Label>
                                                    <Textarea placeholder="Brief description of your professional background and career objectives..." className="rounded-3xl border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-purple-200 transition-all font-bold p-6 min-h-[120px]" />
                                                </div>
                                            </motion.div>
                                        )}

                                        {builderStep === 2 && (
                                            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-500">
                                                        <GraduationCap className="w-6 h-6" />
                                                    </div>
                                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Education</h2>
                                                </div>
                                                <div className="p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100 space-y-6">
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-black uppercase text-gray-400 ml-1">Degree</Label>
                                                            <Input placeholder="B.S. in Computer Science" className="h-14 rounded-2xl border-gray-100 bg-white shadow-sm font-bold px-6" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-black uppercase text-gray-400 ml-1">Institution</Label>
                                                            <Input placeholder="University Name" className="h-14 rounded-2xl border-gray-100 bg-white shadow-sm font-bold px-6" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-black uppercase text-gray-400 ml-1">Year</Label>
                                                            <Input placeholder="2020 - 2024" className="h-14 rounded-2xl border-gray-100 bg-white shadow-sm font-bold px-6" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-black uppercase text-gray-400 ml-1">GPA (Optional)</Label>
                                                            <Input placeholder="3.8/4.0" className="h-14 rounded-2xl border-gray-100 bg-white shadow-sm font-bold px-6" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <button className="w-full h-16 border-2 border-dashed border-purple-100 rounded-2xl flex items-center justify-center gap-2 text-purple-400 font-bold hover:bg-purple-50/50 transition-all">
                                                    <PlusCircle className="w-5 h-5" /> Add Another Education
                                                </button>
                                            </motion.div>
                                        )}

                                        {builderStep === 3 && (
                                            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500">
                                                        <Briefcase className="w-6 h-6" />
                                                    </div>
                                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Experience</h2>
                                                </div>
                                                <div className="p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100 space-y-6">
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-black uppercase text-gray-400 ml-1">Role</Label>
                                                            <Input placeholder="Software Engineer" className="h-14 rounded-2xl border-gray-100 bg-white shadow-sm font-bold px-6" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label className="text-xs font-black uppercase text-gray-400 ml-1">Company</Label>
                                                            <Input placeholder="Tech Corp" className="h-14 rounded-2xl border-gray-100 bg-white shadow-sm font-bold px-6" />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase text-gray-400 ml-1">Duration</Label>
                                                        <Input placeholder="Jan 2022 - Present" className="h-14 rounded-2xl border-gray-100 bg-white shadow-sm font-bold px-6" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase text-gray-400 ml-1">Description</Label>
                                                        <Textarea placeholder="Accomplished X using Y resulting in Z..." className="rounded-3xl border-gray-100 bg-white shadow-sm font-bold p-6 min-h-[120px]" />
                                                    </div>
                                                </div>
                                                <button className="w-full h-16 border-2 border-dashed border-purple-100 rounded-2xl flex items-center justify-center gap-2 text-purple-400 font-bold hover:bg-purple-50/50 transition-all">
                                                    <PlusCircle className="w-5 h-5" /> Add Experience
                                                </button>
                                            </motion.div>
                                        )}

                                        {builderStep === 4 && (
                                            <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-500">
                                                        <Laptop className="w-6 h-6" />
                                                    </div>
                                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Projects</h2>
                                                </div>
                                                <div className="p-8 bg-gray-50/50 rounded-[2rem] border border-gray-100 space-y-6">
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase text-gray-400 ml-1">Project Name</Label>
                                                        <Input placeholder="AI Assistant" className="h-14 rounded-2xl border-gray-100 bg-white shadow-sm font-bold px-6" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase text-gray-400 ml-1">Tech Stack</Label>
                                                        <Input placeholder="React, Node.js, OpenAI" className="h-14 rounded-2xl border-gray-100 bg-white shadow-sm font-bold px-6" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label className="text-xs font-black uppercase text-gray-400 ml-1">Description</Label>
                                                        <Textarea placeholder="Developed a real-time AI tool that..." className="rounded-3xl border-gray-100 bg-white shadow-sm font-bold p-6 min-h-[120px]" />
                                                    </div>
                                                </div>
                                                <button className="w-full h-16 border-2 border-dashed border-purple-100 rounded-2xl flex items-center justify-center gap-2 text-purple-400 font-bold hover:bg-purple-50/50 transition-all">
                                                    <PlusCircle className="w-5 h-5" /> Add Project
                                                </button>
                                            </motion.div>
                                        )}

                                        {builderStep === 5 && (
                                            <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
                                                <div className="flex items-center gap-4 mb-8">
                                                    <div className="w-12 h-12 bg-yellow-50 rounded-2xl flex items-center justify-center text-yellow-500">
                                                        <Wrench className="w-6 h-6" />
                                                    </div>
                                                    <h2 className="text-3xl font-black text-gray-900 tracking-tight">Skills & Tags</h2>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="text-xs font-black uppercase text-gray-400 ml-1">Technical Skills</Label>
                                                    <Textarea
                                                        value={formData.skills}
                                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, skills: e.target.value })}
                                                        placeholder="React, TypeScript, Python, AWS, Docker, Git, Agile..."
                                                        className="rounded-[2.5rem] border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-purple-200 transition-all font-bold p-10 min-h-[200px] text-lg"
                                                    />
                                                </div>
                                                <div className="flex flex-wrap gap-2 pt-4">
                                                    {['FastAPI', 'SQL', 'UI/UX', 'Cloud Architecture', 'DevOps'].map(tag => {
                                                        const isSelected = formData.skills.toLowerCase().includes(tag.toLowerCase());
                                                        return (
                                                            <span
                                                                key={tag}
                                                                onClick={() => {
                                                                    const currentSkills = formData.skills.split(',').map(s => s.trim()).filter(s => s !== '');
                                                                    let newSkills;
                                                                    if (isSelected) {
                                                                        newSkills = currentSkills.filter(s => s.toLowerCase() !== tag.toLowerCase());
                                                                    } else {
                                                                        newSkills = [...currentSkills, tag];
                                                                    }
                                                                    setFormData({ ...formData, skills: newSkills.join(', ') });
                                                                }}
                                                                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all cursor-pointer select-none ${isSelected
                                                                    ? 'bg-[#5c52d2] text-white border-[#5c52d2] shadow-lg shadow-purple-100'
                                                                    : 'bg-purple-50 text-[#5c52d2] border-purple-100 hover:bg-purple-100'
                                                                    }`}
                                                            >
                                                                {isSelected ? '✓' : '+'} {tag}
                                                            </span>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}

                                        {builderStep === 6 && (
                                            <motion.div key="step6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-12">
                                                {/* Top Review Header */}
                                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                                    <div className="space-y-2">
                                                        <h2 className="text-4xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                                                            Your Resume is Ready! 🥳
                                                        </h2>
                                                        <p className="text-gray-400 text-lg font-medium">Review your resume and download it when you're satisfied</p>
                                                    </div>
                                                    <div className="flex flex-wrap gap-4">
                                                        <Button
                                                            onClick={() => setStep('templates')}
                                                            variant="outline"
                                                            className="h-14 px-8 rounded-2xl border-gray-100 font-black text-gray-500 hover:bg-gray-50 gap-2"
                                                        >
                                                            <ArrowLeft className="w-4 h-4" /> Change Template
                                                        </Button>

                                                        <Button
                                                            style={{ backgroundColor: selectedTheme === 'indigo' ? '#5c52d2' : selectedTheme === 'blue' ? '#3b82f6' : selectedTheme === 'rose' ? '#f43f5e' : '#334155' }}
                                                            className="h-14 px-8 rounded-2xl text-white font-black gap-2 shadow-lg hover:opacity-90 transition-all"
                                                        >
                                                            <Download className="w-5 h-5" /> Download PDF
                                                        </Button>
                                                    </div>
                                                </div>

                                                {/* Immersive Preview Region */}
                                                <div className="bg-slate-100/50 rounded-[3rem] p-4 sm:p-12 border border-slate-200/50 min-h-[600px] flex items-center justify-center">
                                                    <div className="bg-white w-full max-w-3xl aspect-[1/1.414] shadow-2xl rounded-sm p-12 overflow-hidden relative">
                                                        <div className="space-y-8">
                                                            <div className="text-center space-y-4 border-b pb-8">
                                                                <h1 className="text-3xl font-black text-gray-900 uppercase tracking-widest">{formData.personal.first} {formData.personal.last}</h1>
                                                                <p className="text-gray-600 font-bold tracking-tight text-lg">Software Engineer</p>
                                                                <div className="text-xs text-gray-400 font-bold flex justify-center gap-4">
                                                                    <span>{formData.personal.email}</span>
                                                                    <span>•</span>
                                                                    <span>{formData.personal.phone}</span>
                                                                    <span>•</span>
                                                                    <span>{formData.personal.location}</span>
                                                                </div>
                                                            </div>
                                                            <div className="h-0.5 bg-gray-900 w-full"></div>
                                                            <div className="grid grid-cols-3 gap-8">
                                                                <div className="space-y-6">
                                                                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Contact</h3>
                                                                    <p className="text-[8px] text-gray-600 font-bold">{formData.personal.email}</p>
                                                                </div>
                                                                <div className="col-span-2 space-y-6">
                                                                    <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-[0.2em]">Experience</h3>
                                                                    {formData.experience.map((exp: any, i: number) => (
                                                                        <div key={i} className="space-y-1">
                                                                            <div className="font-bold text-[10px]">{exp.role} • {exp.company}</div>
                                                                            <div className="text-[8px] text-gray-400 uppercase tracking-widest">{exp.period}</div>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-white to-transparent"></div>
                                                    </div>
                                                </div>

                                                {/* Feature Band */}
                                                <div className="bg-[#eff6ff]/60 border border-blue-100 rounded-[2.5rem] p-10 space-y-8">
                                                    <div className="flex items-center gap-3 text-[#5c52d2]">
                                                        <Sparkles className="w-5 h-5" />
                                                        <h3 className="text-xl font-black">Professional Resume Ready!</h3>
                                                    </div>
                                                    <div className="grid md:grid-cols-3 gap-8 pt-4">
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-5 h-5 bg-green-500 rounded-md flex items-center justify-center text-white">
                                                                    <CheckCircle2 className="w-3 h-3" />
                                                                </div>
                                                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">ATS-Optimized</h4>
                                                            </div>
                                                            <p className="text-xs font-bold text-gray-500 leading-relaxed">Your resume is formatted to pass Applicant Tracking Systems used by recruiters.</p>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-purple-600">
                                                                <Sparkles className="w-5 h-5" />
                                                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Professional Design</h4>
                                                            </div>
                                                            <p className="text-xs font-bold text-gray-500 leading-relaxed">Industry-standard template with clean typography and proper spacing.</p>
                                                        </div>
                                                        <div className="space-y-3">
                                                            <div className="flex items-center gap-2 text-blue-600">
                                                                <div className="relative">
                                                                    <FileText className="w-5 h-5" />
                                                                    <Download className="absolute -bottom-1 -right-1 w-3 h-3 text-blue-700 bg-white rounded-full p-0.5" />
                                                                </div>
                                                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Instant Download</h4>
                                                            </div>
                                                            <p className="text-xs font-bold text-gray-500 leading-relaxed">Click "Download PDF" to get your professionally formatted resume instantly.</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Bottom Navigation */}
                                                <div className="flex flex-col sm:flex-row justify-center gap-6">
                                                    <Button
                                                        onClick={() => setStep('analysis')}
                                                        variant="outline"
                                                        className="h-16 px-10 rounded-2xl border-purple-200 text-[#5c52d2] font-black text-lg hover:bg-purple-50 transition-all gap-2"
                                                    >
                                                        <TrendingUp className="w-5 h-5" /> Analyze Resume
                                                    </Button>
                                                    <Button
                                                        onClick={() => window.location.href = '/dashboard'}
                                                        className="h-16 px-10 rounded-2xl bg-[#5c52d2] hover:bg-[#4b43b0] text-white font-black text-lg gap-3 shadow-xl shadow-purple-200 group"
                                                    >
                                                        Continue Career Journey <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    <div className="flex items-center justify-between mt-12 pt-12 border-t border-gray-50">
                                        <Button
                                            disabled={builderStep === 1}
                                            onClick={() => builderStep > 1 && setBuilderStep((prev) => (prev - 1) as BuilderStep)}
                                            variant="ghost"
                                            className="h-14 px-10 rounded-2xl font-black text-gray-400 hover:text-gray-600 disabled:opacity-0"
                                        >
                                            Previous
                                        </Button>
                                        <Button
                                            onClick={() => builderStep < 5 ? setBuilderStep((prev) => (prev + 1) as BuilderStep) : setStep('templates')}
                                            className="h-14 px-10 rounded-2xl bg-[#5c52d2] hover:bg-[#4b43b0] text-white font-black group gap-3 shadow-lg shadow-purple-100"
                                        >
                                            {builderStep === 5 ? 'Choose Template' : 'Next'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                </Card>
                            </motion.div>
                        )}

                        {step === 'upload' && (
                            <motion.div
                                key="upload"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="max-w-3xl mx-auto py-10 space-y-12"
                            >
                                <div className="text-center space-y-6">
                                    <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                                        <div className="relative">
                                            <FileText className="w-8 h-8 text-blue-400" />
                                            <div className="absolute -top-2 -right-2 bg-red-400 text-white rounded-lg p-1 shadow-sm">
                                                <Upload className="w-3 h-3" />
                                            </div>
                                        </div>
                                    </div>
                                    <h1 className="text-5xl font-black text-white tracking-tight leading-tight drop-shadow-md">Upload Your Resume</h1>
                                    <p className="text-blue-100 text-lg font-medium drop-shadow-sm">Upload your existing resume and let our AI analyze your skills, experience, and qualifications</p>
                                </div>

                                <div className="relative border-2 border-dashed border-white/30 rounded-[3rem] p-16 text-center group hover:border-white/50 transition-all bg-white/10 backdrop-blur-md shadow-xl overflow-hidden">
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="flex flex-col items-center justify-center space-y-6">
                                        <div className="w-20 h-20 bg-gray-50 rounded-[1.5rem] flex items-center justify-center text-gray-300 group-hover:text-[#5c52d2] group-hover:bg-purple-50 transition-all shadow-inner">
                                            <Upload className="w-10 h-10" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-xl font-black text-gray-900">
                                                {file ? file.name : "Drag & drop your resume here"}
                                            </p>
                                            <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">
                                                or click to browse files
                                            </p>
                                        </div>
                                        <p className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Supported formats: PDF, DOC, DOCX (Max 5MB)</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-center gap-6">
                                    <Button
                                        onClick={() => setStep('selection')}
                                        variant="outline"
                                        className="h-14 px-10 rounded-2xl font-black border-gray-200 text-gray-400 hover:text-gray-600"
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        onClick={handleUpload}
                                        disabled={!file || loading}
                                        className="h-14 px-10 rounded-2xl font-black bg-[#5c52d2] hover:bg-[#4b43b0] text-white shadow-xl shadow-purple-100 disabled:opacity-50"
                                    >
                                        {loading ? "Analyzing..." : "Analyze Resume"}
                                    </Button>
                                </div>

                                <div className="bg-[#eff6ff]/60 border border-blue-100 rounded-[2rem] p-8 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-widest">Your Privacy Matters</h4>
                                    </div>
                                    <p className="text-sm font-medium text-gray-500 leading-relaxed">
                                        Your resume is processed securely and used only for analysis. We extract skills, experience, and qualifications to provide personalized career guidance. Your data is never shared with third parties.
                                    </p>
                                </div>

                                {error && (
                                    <div className="p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center gap-4 font-black">
                                        <AlertCircle className="w-6 h-6" />
                                        {error}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {step === 'templates' && (
                            <motion.div
                                key="templates"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-6xl mx-auto py-10 space-y-12"
                            >
                                <div className="text-center space-y-6">
                                    <h1 className="text-5xl font-black text-gray-900 tracking-tight leading-tight">Customize Your Resume</h1>
                                    <p className="text-gray-400 text-lg font-medium max-w-2xl mx-auto">
                                        Select a professional template and theme color that matches your brand. You can preview each style before finalization.
                                    </p>
                                </div>

                                <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50 space-y-8 max-w-4xl mx-auto">
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xs font-black uppercase tracking-[0.3em] text-gray-400">Step 1: Choose Document Theme</h3>
                                        <p className="text-sm font-bold text-gray-500">Pick a primary color for your professional brand</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-6">
                                        {[
                                            { id: 'indigo', color: '#5c52d2', bg: 'bg-[#5c52d2]' },
                                            { id: 'blue', color: '#3b82f6', bg: 'bg-[#3b82f6]' },
                                            { id: 'rose', color: '#f43f5e', bg: 'bg-[#f43f5e]' },
                                            { id: 'slate', color: '#334155', bg: 'bg-[#334155]' }
                                        ].map((theme) => (
                                            <button
                                                key={theme.id}
                                                onClick={() => setSelectedTheme(theme.id)}
                                                className={`w-16 h-16 rounded-[1.5rem] transition-all flex items-center justify-center shadow-lg ${theme.bg} ${selectedTheme === theme.id
                                                    ? 'ring-8 ring-offset-4 ring-gray-50 scale-110'
                                                    : 'hover:scale-105 opacity-80 hover:opacity-100'
                                                    }`}
                                            >
                                                {selectedTheme === theme.id && <CheckCircle2 className="w-7 h-7 text-white" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-3 gap-8">
                                    {[
                                        {
                                            id: 'modern',
                                            name: 'Modern Professional',
                                            desc: 'Clean, modern design with subtle colors and excellent readability',
                                            badge: 'Minimalist with accent colors',
                                            color: 'bg-blue-500',
                                            preview: (
                                                <div className="w-full h-full bg-slate-50 p-4 text-[6px] space-y-2 border-b">
                                                    <div className="border-b pb-2">
                                                        <div className="font-black text-[10px] text-gray-900">John Doe</div>
                                                        <div className="text-blue-500 font-bold">Software Engineer</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-black text-gray-400 uppercase tracking-tighter">Experience</div>
                                                        <div className="font-bold">Senior Developer • Tech Corp</div>
                                                        <div className="text-gray-400 text-[4px]">2022 - Present</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-black text-gray-400 uppercase tracking-tighter">Skills</div>
                                                        <div className="flex gap-1">
                                                            <span className="bg-white border rounded px-1">React</span>
                                                            <span className="bg-white border rounded px-1">Node.js</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        },
                                        {
                                            id: 'classic',
                                            name: 'Classic Traditional',
                                            desc: 'Traditional format preferred by conservative industries',
                                            badge: 'Black & white, formal layout',
                                            color: 'bg-slate-800',
                                            preview: (
                                                <div className="w-full h-full bg-white p-4 text-[6px] space-y-3 border-b">
                                                    <div className="text-center uppercase tracking-widest border-b pb-2">
                                                        <div className="font-black text-[10px]">JOHN DOE</div>
                                                        <div className="text-[4px]">john.doe@email.com • +1 555 123 4567</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-black border-b border-gray-900 pb-0.5 uppercase">Professional Experience</div>
                                                        <div className="font-bold">Senior Developer</div>
                                                        <div className="italic">Tech Corp, 2022 - Present</div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <div className="font-black border-b border-gray-900 pb-0.5 uppercase">Technical Skills</div>
                                                        <div className="text-[5px]">React, Node.js, Python, JavaScript, SQL</div>
                                                    </div>
                                                </div>
                                            )
                                        },
                                        {
                                            id: 'creative',
                                            name: 'Creative Designer',
                                            desc: 'Eye-catching design for creative professionals',
                                            badge: 'Colorful with creative elements',
                                            color: 'bg-pink-500',
                                            preview: (
                                                <div className="w-full h-full bg-pink-50/30 p-4 text-[6px] space-y-2 border-b relative overflow-hidden">
                                                    <div className="absolute top-0 left-0 w-full h-6 bg-pink-500 p-2 text-white font-black text-[8px]">John Doe</div>
                                                    <div className="pt-6">
                                                        <div className="text-pink-600 font-bold">Creative Software Engineer</div>
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-2">
                                                        <div className="space-y-1">
                                                            <div className="font-black text-pink-400 uppercase">Contact</div>
                                                            <div>john.doe@email.com</div>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <div className="font-black text-pink-400 uppercase">Experience</div>
                                                            <div className="font-bold">Senior Developer</div>
                                                        </div>
                                                    </div>
                                                    <div className="bg-white rounded-lg p-2 border border-pink-100">
                                                        <div className="font-black text-pink-400 uppercase mb-1">Skills</div>
                                                        <div className="flex gap-1 text-[4px]">
                                                            <span className="text-pink-600">React • Node.js • Python</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        }
                                    ].map((tmpl) => (
                                        <Card key={tmpl.id} className={`group cursor-pointer border-2 transition-all overflow-hidden rounded-[2.5rem] ${selectedTemplate === tmpl.id ? `border-[${selectedTheme === 'indigo' ? '#5c52d2' : selectedTheme === 'blue' ? '#3b82f6' : selectedTheme === 'rose' ? '#f43f5e' : '#334155'}] shadow-2xl ring-4 ring-purple-100` : 'border-transparent hover:border-gray-200'}`} onClick={() => setSelectedTemplate(tmpl.id)}>
                                            <div className="h-48 overflow-hidden relative">
                                                {tmpl.preview}
                                                <div className="absolute top-4 right-4">
                                                    <div className={`w-6 h-6 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all ${selectedTemplate === tmpl.id ? tmpl.color : 'bg-gray-100'}`}>
                                                        {selectedTemplate === tmpl.id && <CheckCircle2 className="w-3 h-3 text-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                            <CardContent className="p-8 space-y-4">
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">{tmpl.name}</h3>
                                                    <p className="text-gray-400 font-medium text-sm leading-relaxed">{tmpl.desc}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-[#5c52d2]/60">
                                                    <FileText className="w-4 h-4" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">{tmpl.badge}</span>
                                                </div>
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setShowPreview(tmpl.id);
                                                    }}
                                                    variant="outline"
                                                    style={{
                                                        borderColor: selectedTemplate === tmpl.id ? (selectedTheme === 'indigo' ? '#5c52d2' : selectedTheme === 'blue' ? '#3b82f6' : selectedTheme === 'rose' ? '#f43f5e' : '#334155') : undefined,
                                                        color: selectedTemplate === tmpl.id ? (selectedTheme === 'indigo' ? '#5c52d2' : selectedTheme === 'blue' ? '#3b82f6' : selectedTheme === 'rose' ? '#f43f5e' : '#334155') : undefined
                                                    }}
                                                    className={`w-full h-12 rounded-xl font-black transition-all ${selectedTemplate === tmpl.id ? 'bg-purple-50' : 'border-gray-100 text-gray-400 group-hover:border-gray-200'}`}
                                                >
                                                    <Sparkles className="w-4 h-4 mr-2" /> Preview
                                                </Button>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>

                                <div className="max-w-2xl mx-auto">
                                    <Card className={`group cursor-pointer border-2 transition-all overflow-hidden rounded-[2.5rem] bg-[#0d1117] ${selectedTemplate === 'developer' ? 'border-[#5c52d2] shadow-2xl ring-4 ring-purple-100' : 'border-transparent hover:border-gray-800'}`} onClick={() => setSelectedTemplate('developer')}>
                                        <div className="flex md:flex-row flex-col p-8 gap-8 items-center">
                                            <div className="w-64 h-40 bg-[#161b22] rounded-2xl border border-gray-800 p-4 font-mono text-[8px] text-green-400 overflow-hidden relative group-hover:bg-[#1c2128] transition-all flex-shrink-0">
                                                <div className="flex gap-1.5 mb-2">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-yellow-500"></div>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="text-gray-500">$ whoami</div>
                                                    <div className="text-white">john_doe@developer:~</div>
                                                    <div className="text-gray-500 mt-2">class Experience &#123;</div>
                                                    <div className="pl-2">position: "Senior Developer"</div>
                                                    <div className="pl-2">company: "Tech Corp"</div>
                                                    <div className="text-gray-500">&#125;</div>
                                                    <div className="text-blue-400 mt-1">const skills = ["React", "Node.js"]</div>
                                                </div>
                                            </div>
                                            <div className="space-y-4 flex-grow">
                                                <div className="flex items-center justify-between">
                                                    <div className="space-y-1">
                                                        <h3 className="text-2xl font-black text-white tracking-tight">Code / Developer</h3>
                                                        <p className="text-gray-500 font-medium text-sm">A unique terminal-inspired layout for tech roles</p>
                                                    </div>
                                                    <div className={`w-8 h-8 rounded-full border-4 border-[#161b22] shadow-sm flex items-center justify-center transition-all ${selectedTemplate === 'developer' ? '' : 'bg-gray-800'}`}
                                                        style={{ backgroundColor: selectedTemplate === 'developer' ? (selectedTheme === 'indigo' ? '#5c52d2' : selectedTheme === 'blue' ? '#3b82f6' : selectedTheme === 'rose' ? '#f43f5e' : '#334155') : undefined }}
                                                    >
                                                        {selectedTemplate === 'developer' && <CheckCircle2 className="w-4 h-4 text-white" />}
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="flex items-center gap-2 text-green-500/60 uppercase tracking-widest font-black text-[10px]">
                                                        <Laptop className="w-4 h-4" /> Dark Terminal
                                                    </div>
                                                    <div className="flex items-center gap-2 text-blue-500/60 uppercase tracking-widest font-black text-[10px]">
                                                        <PlusCircle className="w-4 h-4" /> JSON-Powered
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                <div className="flex items-center justify-center gap-6 pb-20">
                                    <Button
                                        onClick={() => setStep('builder')}
                                        variant="outline"
                                        className="h-16 px-12 rounded-2xl font-black border-gray-200 text-gray-400 hover:text-gray-600 hover:bg-white"
                                    >
                                        Back to Editor
                                    </Button>
                                    <Button
                                        onClick={() => {
                                            setBuilderStep(6);
                                            setStep('builder');
                                        }}
                                        style={{ backgroundColor: selectedTheme === 'indigo' ? '#5c52d2' : selectedTheme === 'blue' ? '#3b82f6' : selectedTheme === 'rose' ? '#f43f5e' : '#334155' }}
                                        className="h-16 px-12 rounded-2xl font-black text-white shadow-2xl shadow-purple-200 gap-3 group"
                                    >
                                        Confirm Layout <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>

                                {/* Preview Modal */}
                                <AnimatePresence>
                                    {showPreview && (
                                        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.9 }}
                                                className="bg-white w-full max-w-4xl max-h-[90vh] rounded-[3rem] overflow-hidden shadow-2xl relative flex flex-col"
                                            >
                                                <button
                                                    onClick={() => setShowPreview(null)}
                                                    className="absolute top-6 right-6 w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center hover:bg-gray-100 transition-all z-10"
                                                >
                                                    <XCircle className="w-6 h-6 text-gray-400" />
                                                </button>

                                                <div className="p-12 overflow-y-auto">
                                                    <div className="space-y-4 mb-10">
                                                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">Template Preview</h2>
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-3 h-3 rounded-full ${selectedTheme === 'indigo' ? 'bg-[#5c52d2]' : selectedTheme === 'blue' ? 'bg-blue-500' : selectedTheme === 'rose' ? 'bg-rose-500' : 'bg-slate-600'}`}></div>
                                                            <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">{showPreview} Template</p>
                                                        </div>
                                                    </div>

                                                    <div className="aspect-[1/1.4] bg-gray-50 rounded-3xl border-2 border-gray-100 shadow-inner p-10 overflow-hidden relative">
                                                        {/* Full Scale Preview Mockup */}
                                                        <div className="space-y-10 scale-150 origin-top transform">
                                                            <div className="flex justify-between items-start border-b pb-8">
                                                                <div>
                                                                    <h1 className="text-2xl font-black text-gray-900">{formData.personal.first} {formData.personal.last}</h1>
                                                                    <p className="text-blue-500 font-bold text-sm">Software Engineer</p>
                                                                </div>
                                                                <div className="text-[8px] text-gray-400 text-right font-medium">
                                                                    {formData.personal.email}<br />
                                                                    {formData.personal.phone}<br />
                                                                    {formData.personal.location}
                                                                </div>
                                                            </div>

                                                            <div className="space-y-6">
                                                                <div className="flex gap-10">
                                                                    <div className="w-1/3 space-y-4">
                                                                        <div className="space-y-2">
                                                                            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Skills</h3>
                                                                            <div className="flex flex-wrap gap-1">
                                                                                {formData.skills.split(',').map((s: string) => (
                                                                                    <span key={s} className="bg-white border text-[6px] px-1 rounded-sm">{s.trim()}</span>
                                                                                ))}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="w-2/3 space-y-6">
                                                                        <div className="space-y-2">
                                                                            <h3 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Experience</h3>
                                                                            {formData.experience.map((exp: any, i: number) => (
                                                                                <div key={i} className="space-y-1">
                                                                                    <div className="font-bold text-[8px]">{exp.role} • {exp.company}</div>
                                                                                    <div className="text-[6px] text-gray-400 italic">{exp.period}</div>
                                                                                    <p className="text-[6px] text-gray-500 leading-relaxed">{exp.desc}</p>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Gradient Overlay for Fade Out */}
                                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-transparent to-transparent pointer-events-none"></div>
                                                    </div>
                                                </div>

                                                <div className="p-8 bg-gray-50 border-t flex justify-end gap-4">
                                                    <Button onClick={() => setShowPreview(null)} variant="ghost" className="font-black text-gray-400">Close Preview</Button>
                                                    <Button
                                                        onClick={() => {
                                                            setSelectedTemplate(showPreview!);
                                                            setShowPreview(null);
                                                        }}
                                                        style={{ backgroundColor: selectedTheme === 'indigo' ? '#5c52d2' : selectedTheme === 'blue' ? '#3b82f6' : selectedTheme === 'rose' ? '#f43f5e' : '#334155' }}
                                                        className="font-black text-white px-8 rounded-xl"
                                                    >
                                                        Select This Template
                                                    </Button>
                                                </div>
                                            </motion.div>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}

                        {step === 'analysis' && analysis && (
                            <motion.div
                                key="analysis"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-5xl mx-auto py-10 space-y-10"
                            >
                                {/* Header Section */}
                                <div className="text-center space-y-6">
                                    <div className="w-20 h-20 bg-yellow-50 rounded-[2rem] flex items-center justify-center mx-auto shadow-sm">
                                        <Sparkles className="w-10 h-10 text-yellow-500" />
                                    </div>
                                    <div className="space-y-2">
                                        <h1 className="text-5xl font-black text-gray-900 tracking-tight">Resume Analysis Complete!</h1>
                                        <p className="text-gray-400 text-lg font-medium">Here's what we discovered about your professional profile</p>
                                    </div>
                                </div>

                                {/* Overall Score Card */}
                                <Card className="border-none shadow-sm bg-white p-16 rounded-[3rem] text-center space-y-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-8 text-blue-50/50 group-hover:text-blue-50 transition-colors">
                                        <TrendingUp className="w-32 h-32" />
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className="flex items-center gap-3 text-blue-500 mb-2">
                                            <TrendingUp className="w-6 h-6" />
                                            <h3 className="text-xl font-black uppercase tracking-widest">Overall Profile Score</h3>
                                        </div>
                                        <span className="text-[120px] leading-none font-black text-[#5c52d2] tracking-tighter">
                                            {analysis.ats_score}%
                                        </span>
                                        <p className="text-xl font-bold text-gray-400 mt-4">
                                            {analysis.ats_score > 80 ? 'Excellent profile!' : analysis.ats_score > 60 ? 'Good profile!' : 'Needs improvement'}
                                        </p>
                                    </div>
                                </Card>

                                {/* Info & Experience Row */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Personal Info Card */}
                                    <Card className="border-none shadow-sm bg-white p-10 rounded-[3rem] space-y-8">
                                        <div className="flex items-center gap-3 text-[#5c52d2]">
                                            <User className="w-6 h-6" />
                                            <h3 className="text-xl font-black tracking-tight">Personal Information</h3>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Name</p>
                                                <p className="font-bold text-gray-700 text-lg">{formData.personal.first} {formData.personal.last || 'GUNDA SRI VIGNESH'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Email</p>
                                                <p className="font-bold text-gray-700">{formData.personal.email || 'Not found'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Phone</p>
                                                <p className="font-bold text-gray-700">{formData.personal.phone || 'Not detected - add your phone number'}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Location</p>
                                                <p className="font-bold text-gray-700">{formData.personal.location || 'Not specified in resume'}</p>
                                            </div>
                                        </div>
                                    </Card>

                                    {/* Experience Summary Card */}
                                    <Card className="border-none shadow-sm bg-white p-10 rounded-[3rem] space-y-8">
                                        <div className="flex items-center gap-3 text-blue-500">
                                            <Briefcase className="w-6 h-6" />
                                            <h3 className="text-xl font-black tracking-tight">Experience Summary</h3>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="space-y-2">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Total Experience</p>
                                                <p className="font-black text-gray-900 text-2xl">{formData.experience.length} position(s)</p>
                                            </div>
                                            <div className="space-y-4">
                                                <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Positions Found</p>
                                                <ul className="space-y-3">
                                                    {formData.experience.map((exp: any, i: number) => (
                                                        <li key={i} className="flex items-center gap-3 text-gray-600 font-bold text-sm">
                                                            <div className="w-1.5 h-1.5 bg-blue-400 rounded-full" />
                                                            {exp.role || 'Time Management, Adaptability, Active Listening, Leadership, Logical Thinking'}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    </Card>
                                </div>

                                {/* Identified Skills Card */}
                                <Card className="border-none shadow-sm bg-white p-10 rounded-[3rem] space-y-8">
                                    <div className="flex items-center gap-3 text-blue-400">
                                        <Laptop className="w-6 h-6" />
                                        <h3 className="text-xl font-black tracking-tight">Identified Skills</h3>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {formData.skills.split(',').map((skill: string, i: number) => (
                                            <span key={i} className="px-6 py-3 bg-blue-50 text-blue-600 rounded-full font-bold text-sm border border-blue-100/50 hover:scale-105 transition-all cursor-default">
                                                {skill.trim().toLowerCase()}
                                            </span>
                                        ))}
                                    </div>
                                </Card>

                                {/* Strengths & Recommendations Row */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Key Strengths Card */}
                                    <Card className="border-none shadow-sm bg-white p-10 rounded-[3rem] space-y-8">
                                        <div className="flex items-center gap-3 text-green-500">
                                            <CheckCircle2 className="w-6 h-6" />
                                            <h3 className="text-xl font-black tracking-tight">Key Strengths</h3>
                                        </div>
                                        <ul className="space-y-4">
                                            {analysis.strengths?.map((strength: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 group">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full mt-2 group-hover:scale-125 transition-transform" />
                                                    <span className="font-bold text-gray-600 leading-relaxed">{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>

                                    {/* Recommendations Card */}
                                    <Card className="border-none shadow-sm bg-white p-10 rounded-[3rem] space-y-8">
                                        <div className="flex items-center gap-3 text-orange-400">
                                            <div className="w-6 h-6 rounded-full border-2 border-orange-400 flex items-center justify-center font-black text-[10px]">!</div>
                                            <h3 className="text-xl font-black tracking-tight">Recommendations</h3>
                                        </div>
                                        <ul className="space-y-4">
                                            {analysis.weaknesses?.map((rec: string, i: number) => (
                                                <li key={i} className="flex items-start gap-3 group">
                                                    <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 group-hover:scale-125 transition-transform" />
                                                    <span className="font-bold text-gray-600 leading-relaxed">{rec}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </Card>
                                </div>

                                {/* Footer Action */}
                                <div className="flex justify-center pt-8">
                                    <Button
                                        onClick={() => window.location.href = '/career'}
                                        style={{ background: 'linear-gradient(135deg, #5c52d2 0%, #7c3aed 100%)' }}
                                        className="h-16 px-12 rounded-2xl font-black text-white text-lg gap-4 shadow-2xl shadow-purple-200 group hover:scale-[1.02] transition-all"
                                    >
                                        Continue to Domain Selection <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>
            </div>
        </div>
    );
}
