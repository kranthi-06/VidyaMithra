import { useState, useRef, useEffect } from 'react';
import { PremiumNavbar } from '../components/PremiumNavbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '../context/AuthContext';
import {
    User, Mail, Phone, MapPin, Briefcase, Calendar,
    Linkedin, Github, Globe, FileText, Award, Star,
    Edit2, Camera, Save, X, Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Profile() {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Initial state with mock data
    const [profile, setProfile] = useState({
        role: "Software Engineer",
        location: "Visakhapatnam, India",
        joined: "February 2026",
        phone: "+91 98765 43210",
        bio: "Passionate full-stack developer with a keen interest in AI/ML and building scalable web applications. Currently focused on mastering React and FastAPI.",
        skills: ["React", "TypeScript", "Python", "FastAPI", "Tailwind CSS", "PostgreSQL"],
        socials: {
            linkedin: "linkedin.com/in/ashokyeddula",
            github: "github.com/ashokyeddula",
            portfolio: "ashokyeddula.dev"
        },
        image: null as string | null
    });

    // Load profile from localStorage on mount
    useEffect(() => {
        if (user?.email) {
            const savedProfile = localStorage.getItem(`user_profile_${user.email}`);
            if (savedProfile) {
                try {
                    setProfile(JSON.parse(savedProfile));
                } catch (e) {
                    console.error("Failed to parse profile", e);
                }
            }
        }
    }, [user?.email]);

    const handleSave = () => {
        if (user?.email) {
            try {
                localStorage.setItem(`user_profile_${user.email}`, JSON.stringify(profile));
                setIsEditing(false);
            } catch (error) {
                console.error("Failed to save profile:", error);
                alert("Failed to save changes. Your profile image might be too large for local storage.");
            }
        }
    };

    const [newSkill, setNewSkill] = useState("");

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfile(prev => ({ ...prev, image: reader.result as string }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddSkill = () => {
        if (newSkill.trim() && !profile.skills.includes(newSkill.trim())) {
            setProfile(prev => ({
                ...prev,
                skills: [...prev.skills, newSkill.trim()]
            }));
            setNewSkill("");
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setProfile(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] font-sans pb-20">
            <PremiumNavbar />

            <main className="max-w-5xl mx-auto px-6 pt-10">
                <div className="bg-white rounded-[2.5rem] shadow-xl overflow-hidden border border-slate-100 relative">
                    {/* Header Banner */}
                    <div className="h-48 bg-gradient-to-r from-[#5c52d2] to-[#7c66dc] relative">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-[80px]"></div>
                        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24 blur-[60px]"></div>

                        {/* Edit Button */}
                        <div className="absolute top-6 right-6 z-10">
                            {isEditing ? (
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => setIsEditing(false)}
                                        className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md"
                                        size="sm"
                                    >
                                        <X className="w-4 h-4 mr-2" /> Cancel
                                    </Button>
                                    <Button
                                        onClick={handleSave}
                                        className="bg-white text-[#5c52d2] hover:bg-gray-100 border-none shadow-lg"
                                        size="sm"
                                    >
                                        <Save className="w-4 h-4 mr-2" /> Save Changes
                                    </Button>
                                </div>
                            ) : (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="bg-white/20 hover:bg-white/30 text-white border-none backdrop-blur-md transition-all"
                                    size="sm"
                                >
                                    <Edit2 className="w-4 h-4 mr-2" /> Edit Profile
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="px-8 md:px-12 pb-12">
                        {/* Profile Image & Basic Info */}
                        <div className="relative -mt-20 mb-8 flex flex-col md:flex-row items-center md:items-end gap-6 text-center md:text-left">
                            <div className="relative group">
                                <div className="w-40 h-40 bg-white p-2 rounded-[2.5rem] shadow-lg relative z-10">
                                    <div className="w-full h-full bg-slate-100 rounded-[2rem] flex items-center justify-center overflow-hidden relative">
                                        {profile.image ? (
                                            <img src={profile.image} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <User className="w-16 h-16 text-slate-300" />
                                        )}

                                        {/* Image Upload Overlay */}
                                        {isEditing && (
                                            <div
                                                onClick={() => fileInputRef.current?.click()}
                                                className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Camera className="w-8 h-8 text-white" />
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 pb-2 space-y-2 w-full md:w-auto">
                                <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                                    {user?.full_name || 'User Profile'}
                                </h1>

                                {isEditing ? (
                                    <Input
                                        value={profile.role}
                                        onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                                        className="max-w-xs mx-auto md:mx-0 font-bold text-lg h-10 border-slate-200"
                                        placeholder="Current Role"
                                    />
                                ) : (
                                    <p className="text-slate-500 font-bold text-lg flex items-center justify-center md:justify-start gap-2">
                                        <Briefcase className="w-4 h-4" /> {profile.role}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid md:grid-cols-3 gap-12">
                            {/* Left Column: Contact & Socials */}
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        <User className="w-5 h-5 text-[#5c52d2]" /> Contact Info
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                                            <Mail className="w-4 h-4 shrink-0" />
                                            <span className="truncate">{user?.email}</span>
                                        </div>

                                        <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                                            <Phone className="w-4 h-4 shrink-0" />
                                            {isEditing ? (
                                                <Input
                                                    value={profile.phone}
                                                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                                    className="h-8 text-sm"
                                                    placeholder="Phone Number"
                                                />
                                            ) : (
                                                <span>{profile.phone}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                                            <MapPin className="w-4 h-4 shrink-0" />
                                            {isEditing ? (
                                                <Input
                                                    value={profile.location}
                                                    onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                                                    className="h-8 text-sm"
                                                    placeholder="Location"
                                                />
                                            ) : (
                                                <span>{profile.location}</span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 text-slate-500 font-medium text-sm">
                                            <Calendar className="w-4 h-4 shrink-0" />
                                            <span>Joined {profile.joined}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        <Globe className="w-5 h-5 text-[#5c52d2]" /> Social Presence
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                                <Linkedin className="w-4 h-4 shrink-0" />
                                                {isEditing ? (
                                                    <Input
                                                        value={profile.socials.linkedin}
                                                        onChange={(e) => setProfile({
                                                            ...profile,
                                                            socials: { ...profile.socials, linkedin: e.target.value }
                                                        })}
                                                        className="h-8 text-sm"
                                                        placeholder="LinkedIn URL"
                                                    />
                                                ) : (
                                                    <a href={`https://${profile.socials.linkedin}`} target="_blank" rel="noreferrer" className="hover:text-[#0077b5] transition-colors hover:underline">
                                                        LinkedIn
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                                <Github className="w-4 h-4 shrink-0" />
                                                {isEditing ? (
                                                    <Input
                                                        value={profile.socials.github}
                                                        onChange={(e) => setProfile({
                                                            ...profile,
                                                            socials: { ...profile.socials, github: e.target.value }
                                                        })}
                                                        className="h-8 text-sm"
                                                        placeholder="GitHub URL"
                                                    />
                                                ) : (
                                                    <a href={`https://${profile.socials.github}`} target="_blank" rel="noreferrer" className="hover:text-slate-900 transition-colors hover:underline">
                                                        GitHub
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3 text-slate-500 font-bold text-sm">
                                                <FileText className="w-4 h-4 shrink-0" />
                                                {isEditing ? (
                                                    <Input
                                                        value={profile.socials.portfolio}
                                                        onChange={(e) => setProfile({
                                                            ...profile,
                                                            socials: { ...profile.socials, portfolio: e.target.value }
                                                        })}
                                                        className="h-8 text-sm"
                                                        placeholder="Portfolio URL"
                                                    />
                                                ) : (
                                                    <a href={`https://${profile.socials.portfolio}`} target="_blank" rel="noreferrer" className="hover:text-emerald-500 transition-colors hover:underline">
                                                        Portfolio
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Bio & Skills */}
                            <div className="md:col-span-2 space-y-8 border-t md:border-t-0 md:border-l border-slate-100 pt-8 md:pt-0 md:pl-12">
                                <div className="space-y-4">
                                    <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        <FileText className="w-5 h-5 text-[#5c52d2]" /> About Me
                                    </h3>
                                    {isEditing ? (
                                        <Textarea
                                            value={profile.bio}
                                            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                                            className="min-h-[120px] text-slate-600 font-medium"
                                            placeholder="Write a short bio about yourself..."
                                        />
                                    ) : (
                                        <p className="text-slate-500 leading-relaxed font-medium">
                                            {profile.bio}
                                        </p>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        <Award className="w-5 h-5 text-[#5c52d2]" /> Core Skills
                                    </h3>

                                    <div className="flex flex-wrap gap-2">
                                        {profile.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl font-bold text-xs uppercase tracking-wider border border-slate-100 flex items-center gap-2 group cursor-default"
                                            >
                                                {skill}
                                                {isEditing && (
                                                    <button
                                                        onClick={() => handleRemoveSkill(skill)}
                                                        className="hover:text-red-500 transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                )}
                                            </span>
                                        ))}

                                        {isEditing && (
                                            <div className="flex items-center gap-2">
                                                <Input
                                                    value={newSkill}
                                                    onChange={(e) => setNewSkill(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                                                    className="h-8 w-32 text-xs"
                                                    placeholder="Add skill..."
                                                />
                                                <Button
                                                    onClick={handleAddSkill}
                                                    size="icon"
                                                    className="h-8 w-8 rounded-xl bg-[#5c52d2] hover:bg-[#4a42b8]"
                                                >
                                                    <Plus className="w-4 h-4 text-white" />
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
