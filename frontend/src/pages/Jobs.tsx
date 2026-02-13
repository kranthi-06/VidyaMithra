import { useState } from 'react';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Search,
    MapPin,
    Briefcase,
    ExternalLink,
    Star,
    Globe,
    Clock,
    IndianRupee,
    ChevronDown
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function Jobs() {
    const [searchTerm, setSearchTerm] = useState('android, api, css, data, python');
    const [location, setLocation] = useState('Nationwide');
    const [jobType, setJobType] = useState('All Types');

    const jobData = [
        {
            title: 'Python Tutor',
            company: 'CodeAcademy',
            platform: 'LinkedIn',
            location: 'Remote',
            score: 54,
            status: 'FAIR MATCH',
            desc: 'Teach Python programming online...',
            type: 'Remote, Part-time',
            salary: '₹600/hr',
            platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png'
        },
        {
            title: 'Full Stack Engineer',
            company: 'TechCorp',
            platform: 'Naukri',
            location: 'Remote',
            score: 48,
            status: 'DEVELOPING',
            desc: 'Build scalable web applications using modern tech stack...',
            type: 'Remote, Full-time',
            salary: '₹15-25 LPA',
            platformLogo: 'https://static.naukimg.com/s/4/100/i/naukri_Logo.png'
        },
        {
            title: 'Senior Backend Engineer',
            company: 'CloudSystems',
            platform: 'LinkedIn',
            location: 'Remote',
            score: 48,
            status: 'DEVELOPING',
            desc: 'Design distributed systems and microservices...',
            type: 'Remote, Full-time',
            salary: '₹20-35 LPA',
            platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png'
        },
        {
            title: 'Frontend Developer',
            company: 'WebInnovate',
            platform: 'Naukri',
            location: 'Remote',
            score: 48,
            status: 'DEVELOPING',
            desc: 'Create responsive user interfaces with React...',
            type: 'Remote, Full-time',
            salary: '₹12-20 LPA',
            platformLogo: 'https://static.naukimg.com/s/4/100/i/naukri_Logo.png'
        },
        {
            title: 'Frontend Consultant',
            company: 'Freelance Corp',
            platform: 'Naukri',
            location: 'Remote',
            score: 48,
            status: 'DEVELOPING',
            desc: 'Build scalable frontend development consulting...',
            type: 'Remote, Part-time',
            salary: '₹800/hr',
            platformLogo: 'https://static.naukimg.com/s/4/100/i/naukri_Logo.png'
        },
        {
            title: 'Data Science Contractor',
            company: 'Analytics Co',
            platform: 'Naukri',
            location: 'Remote',
            score: 48,
            status: 'DEVELOPING',
            desc: 'Part-time data analysis projects...',
            type: 'Remote, Part-time',
            salary: '₹1000/hr',
            platformLogo: 'https://static.naukimg.com/s/4/100/i/naukri_Logo.png'
        },
        {
            title: 'Contract Python Developer',
            company: 'TempWork',
            platform: 'LinkedIn',
            location: 'Remote',
            score: 48,
            status: 'DEVELOPING',
            desc: 'Backend development contract role...',
            type: 'Remote, Contract',
            salary: '₹1000-1300/hr',
            platformLogo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png'
        }
    ];

    const handleApply = (title: string, platform: string) => {
        const query = encodeURIComponent(title);
        if (platform === 'Naukri') {
            window.open(`https://www.naukri.com/${query.replace(/%20/g, '-')}-jobs`, '_blank');
        } else {
            window.open(`https://www.linkedin.com/jobs/search/?keywords=${query}`, '_blank');
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
            <PremiumNavbar />



            <main className="max-w-[1240px] mx-auto px-6 pt-4">
                <div className="space-y-2 mb-10">
                    <h1 className="text-3xl font-[900] text-slate-900 tracking-tight">Job Opportunities</h1>
                    <p className="text-slate-400 font-medium">Find jobs matching your skills and experience from Naukri and LinkedIn</p>
                </div>

                {/* Search Bar Section */}
                <Card className="p-8 rounded-[2rem] border-2 border-slate-100 bg-white shadow-xl shadow-slate-100/50 mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Your Skills *</label>
                            <Input
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="h-14 rounded-xl border-slate-100 bg-slate-50/50 font-bold focus:bg-white transition-all shadow-inner"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Location</label>
                            <div className="relative group">
                                <select
                                    className="w-full h-14 pl-5 pr-10 rounded-xl border-2 border-slate-100 bg-slate-50/50 font-bold appearance-none focus:border-[#5c52d2] outline-none transition-all"
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                >
                                    <option>Nationwide</option>
                                    <option>Remote</option>
                                    <option>Bangalore</option>
                                    <option>Mumbai</option>
                                    <option>Delhi NCR</option>
                                    <option>Hyderabad</option>
                                    <option>Pune</option>
                                    <option>Chennai</option>
                                    <option>Kolkata</option>
                                    <option>Ahmedabad</option>
                                    <option>Gurugram</option>
                                    <option>Noida</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors pointer-events-none" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest px-1">Job Type</label>
                            <div className="relative group">
                                <select
                                    className="w-full h-14 pl-5 pr-10 rounded-xl border-2 border-slate-100 bg-slate-50/50 font-bold appearance-none focus:border-[#5c52d2] outline-none transition-all"
                                    value={jobType}
                                    onChange={(e) => setJobType(e.target.value)}
                                >
                                    <option>All Types</option>
                                    <option>Full-time</option>
                                    <option>Part-time</option>
                                    <option>Contract</option>
                                    <option>Freelance</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors pointer-events-none" />
                            </div>
                        </div>
                    </div>
                    <Button className="w-full h-14 mt-8 rounded-xl bg-[#b195ff] hover:bg-[#a284ff] text-white font-black text-sm uppercase tracking-[0.2em] shadow-lg shadow-purple-100 transition-all flex items-center gap-3">
                        <Search className="w-4 h-4" /> Search Jobs
                    </Button>
                </Card>

                {/* Results Section */}
                <div className="space-y-1 mb-8">
                    <h2 className="text-2xl font-[900] text-slate-800">Found {jobData.length} Jobs</h2>
                    <p className="text-slate-400 text-sm font-bold">Matching skills: <span className="text-blue-500">{searchTerm}</span></p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobData.map((job, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className="p-8 rounded-[2.5rem] border-none shadow-xl shadow-slate-200/40 bg-white hover:scale-[1.02] transition-all flex flex-col h-full relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-black text-slate-800 leading-tight pr-12">{job.title}</h3>
                                    <div className={`absolute top-6 right-6 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm ${job.score > 50 ? 'bg-orange-400' : 'bg-red-500'
                                        } text-white`}>
                                        <Star className="w-3 h-3 fill-current" />
                                        <span className="text-xs font-black">{job.score}%</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 mb-6 text-slate-500 font-bold text-sm">
                                    <div className="w-5 h-5 bg-slate-50 rounded-sm flex items-center justify-center p-0.5">
                                        <img src={job.platformLogo} alt={job.platform} className="w-full h-full object-contain" />
                                    </div>
                                    <span className="text-slate-400 text-xs tracking-tight">{job.company}</span>
                                    <span className="mx-1 opacity-20">•</span>
                                    <Globe className="w-3 h-3 text-slate-300" />
                                    <span className="text-slate-400 text-xs tracking-tight">{job.platform}</span>
                                </div>

                                <div className="flex items-center gap-1.5 mb-2">
                                    <MapPin className="w-3.5 h-3.5 text-[#5c52d2]" />
                                    <span className="text-xs font-black text-slate-400">{job.location}</span>
                                </div>

                                <div className="mb-4">
                                    <span className={`text-[10px] font-black uppercase tracking-widest ${job.status === 'FAIR MATCH' ? 'text-orange-500' : 'text-red-500'
                                        }`}>
                                        {job.status}
                                    </span>
                                    <p className="text-slate-500 text-sm font-medium mt-1 mb-6 leading-relaxed">
                                        {job.desc}
                                    </p>
                                </div>

                                <div className="mt-auto space-y-6">
                                    <div className="flex flex-wrap gap-2">
                                        <div className="px-4 py-1.5 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 flex items-center gap-2">
                                            <Clock className="w-3 h-3" /> {job.type}
                                        </div>
                                        <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black flex items-center gap-2">
                                            <IndianRupee className="w-3 h-3" /> {job.salary}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleApply(job.title, job.platform)}
                                        className="w-full h-14 rounded-2xl bg-[#b195ff] hover:bg-[#a284ff] text-white font-black text-sm transition-all group shadow-lg shadow-purple-50"
                                    >
                                        Apply Now <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform opacity-50" />
                                    </Button>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </div>
            </main>
        </div>
    );
}
