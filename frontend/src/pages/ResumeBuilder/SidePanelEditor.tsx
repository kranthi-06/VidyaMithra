import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, GraduationCap, Briefcase, Laptop, Wrench, Sparkles,
    Loader2, Plus, Trash2, ChevronRight
} from 'lucide-react';
import type { ResumeData, PersonalInfo, EducationItem, ExperienceItem, ProjectItem } from './types';
import { enhancePersonalInfo, enhanceEducation, enhanceExperience, enhanceProjects, enhanceSkills } from '../../services/resumeBuilder';
import type { TemplateId } from './templates';

type PanelTab = 'personal' | 'education' | 'experience' | 'projects' | 'skills';

interface SidePanelEditorProps {
    data: ResumeData;
    onChange: (d: Partial<ResumeData>) => void;
    selectedTemplate: TemplateId;
}

const TABS: { id: PanelTab; label: string; icon: any }[] = [
    { id: 'personal', label: 'Personal', icon: User },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'projects', label: 'Projects', icon: Laptop },
    { id: 'skills', label: 'Skills', icon: Wrench },
];

export function SidePanelEditor({ data, onChange, selectedTemplate }: SidePanelEditorProps) {
    const [activeTab, setActiveTab] = useState<PanelTab>('personal');
    const [aiLoading, setAiLoading] = useState<string | null>(null);

    const handleAIImprove = async (section: PanelTab) => {
        setAiLoading(section);
        try {
            switch (section) {
                case 'personal': {
                    const result = await enhancePersonalInfo({
                        personal_info: data.personal,
                        target_role: data.target_role,
                        template_style: selectedTemplate,
                    });
                    if (result && !result.error) {
                        onChange({ personal: { ...data.personal, professional_summary: result.professional_summary || data.personal.professional_summary } });
                    }
                    break;
                }
                case 'education': {
                    const result = await enhanceEducation({
                        education: data.education,
                        target_role: data.target_role,
                    });
                    if (result && !result.error && result.education) {
                        onChange({ education: result.education });
                    }
                    break;
                }
                case 'experience': {
                    const result = await enhanceExperience({
                        experience: data.experience,
                        target_role: data.target_role,
                        template_style: selectedTemplate,
                    });
                    if (result && !result.error && result.experience) {
                        onChange({ experience: result.experience });
                    }
                    break;
                }
                case 'projects': {
                    const result = await enhanceProjects({
                        projects: data.projects,
                        target_role: data.target_role,
                    });
                    if (result && !result.error && result.projects) {
                        onChange({ projects: result.projects });
                    }
                    break;
                }
                case 'skills': {
                    const result = await enhanceSkills({
                        skills: data.skills,
                        target_role: data.target_role,
                    });
                    if (result && !result.error) {
                        onChange({
                            skills: {
                                ...data.skills,
                                technical_skills: result.technical_skills || data.skills.technical_skills,
                                tools: result.tools || data.skills.tools,
                                soft_skills: result.soft_skills || data.skills.soft_skills,
                            }
                        });
                    }
                    break;
                }
            }
        } catch (e) {
            console.error('AI improve error:', e);
        }
        setAiLoading(null);
    };

    const updatePersonal = (field: keyof PersonalInfo, value: string) => {
        onChange({ personal: { ...data.personal, [field]: value } });
    };

    const updateEducation = (index: number, field: keyof EducationItem, value: string) => {
        const updated = [...data.education];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ education: updated });
    };

    const addEducation = () => {
        onChange({ education: [...data.education, { degree: '', institution: '', duration: '', description: '' }] });
    };

    const removeEducation = (index: number) => {
        onChange({ education: data.education.filter((_, i) => i !== index) });
    };

    const updateExperience = (index: number, field: keyof ExperienceItem, value: any) => {
        const updated = [...data.experience];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ experience: updated });
    };

    const updateExperienceBullet = (expIndex: number, bulletIndex: number, value: string) => {
        const updated = [...data.experience];
        const bullets = [...(updated[expIndex].bullets || [])];
        bullets[bulletIndex] = value;
        updated[expIndex] = { ...updated[expIndex], bullets };
        onChange({ experience: updated });
    };

    const addExperienceBullet = (expIndex: number) => {
        const updated = [...data.experience];
        updated[expIndex] = { ...updated[expIndex], bullets: [...(updated[expIndex].bullets || []), ''] };
        onChange({ experience: updated });
    };

    const removeExperienceBullet = (expIndex: number, bulletIndex: number) => {
        const updated = [...data.experience];
        updated[expIndex] = { ...updated[expIndex], bullets: (updated[expIndex].bullets || []).filter((_, i) => i !== bulletIndex) };
        onChange({ experience: updated });
    };

    const addExperience = () => {
        onChange({ experience: [...data.experience, { title: '', organization: '', duration: '', description: '', bullets: [''] }] });
    };

    const removeExperience = (index: number) => {
        onChange({ experience: data.experience.filter((_, i) => i !== index) });
    };

    const updateProject = (index: number, field: keyof ProjectItem, value: string) => {
        const updated = [...data.projects];
        updated[index] = { ...updated[index], [field]: value };
        onChange({ projects: updated });
    };

    const addProject = () => {
        onChange({ projects: [...data.projects, { name: '', technologies: '', description: '' }] });
    };

    const removeProject = (index: number) => {
        onChange({ projects: data.projects.filter((_, i) => i !== index) });
    };

    const updateSkillCategory = (category: 'technical_skills' | 'tools' | 'soft_skills', value: string) => {
        onChange({
            skills: {
                ...data.skills,
                [category]: value.split(',').map(s => s.trim()).filter(Boolean),
            }
        });
    };

    const inputCls = "w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-[#5c52d2] transition-all placeholder-gray-300";
    const textareaCls = "w-full px-3 py-2 text-xs bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-[#5c52d2] transition-all resize-none placeholder-gray-300";
    const labelCls = "text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1 block";

    return (
        <div className="h-full flex flex-col bg-gray-50/80 rounded-2xl border border-gray-200 overflow-hidden">
            {/* Tab Bar */}
            <div className="flex border-b border-gray-200 bg-white shrink-0 overflow-x-auto">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-1.5 px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider whitespace-nowrap transition-all border-b-2 ${activeTab === tab.id
                                    ? 'text-[#5c52d2] border-[#5c52d2] bg-purple-50/50'
                                    : 'text-gray-400 border-transparent hover:text-gray-600 hover:bg-gray-50'
                                }`}
                        >
                            <Icon className="w-3.5 h-3.5" />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* AI Improve Button — always visible */}
            <div className="px-3 py-2 border-b border-gray-100 bg-white shrink-0">
                <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleAIImprove(activeTab)}
                    disabled={!!aiLoading}
                    className="w-full py-2 bg-gradient-to-r from-[#5c52d2] to-[#7c3aed] text-white rounded-xl font-bold text-[10px] shadow-md shadow-purple-100 hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-1.5"
                >
                    {aiLoading === activeTab ? (
                        <><Loader2 className="w-3 h-3 animate-spin" /> Improving...</>
                    ) : (
                        <><Sparkles className="w-3 h-3" /> ✨ Improve {TABS.find(t => t.id === activeTab)?.label} with AI</>
                    )}
                </motion.button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.15 }}
                        className="space-y-3"
                    >
                        {/* PERSONAL TAB */}
                        {activeTab === 'personal' && (
                            <>
                                <div>
                                    <label className={labelCls}>Full Name</label>
                                    <input className={inputCls} value={data.personal.full_name} onChange={e => updatePersonal('full_name', e.target.value)} placeholder="John Doe" />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className={labelCls}>Email</label>
                                        <input className={inputCls} value={data.personal.email} onChange={e => updatePersonal('email', e.target.value)} placeholder="email@example.com" />
                                    </div>
                                    <div>
                                        <label className={labelCls}>Phone</label>
                                        <input className={inputCls} value={data.personal.phone} onChange={e => updatePersonal('phone', e.target.value)} placeholder="+1 234 567 8900" />
                                    </div>
                                </div>
                                <div>
                                    <label className={labelCls}>Location</label>
                                    <input className={inputCls} value={data.personal.location} onChange={e => updatePersonal('location', e.target.value)} placeholder="City, Country" />
                                </div>
                                <div>
                                    <label className={labelCls}>Professional Summary</label>
                                    <textarea className={textareaCls} rows={5} value={data.personal.professional_summary} onChange={e => updatePersonal('professional_summary', e.target.value)} placeholder="Experienced professional with..." />
                                </div>
                            </>
                        )}

                        {/* EDUCATION TAB */}
                        {activeTab === 'education' && (
                            <>
                                {data.education.map((ed, i) => (
                                    <div key={i} className="p-3 bg-white rounded-xl border border-gray-100 space-y-2 relative">
                                        {data.education.length > 1 && (
                                            <button onClick={() => removeEducation(i)} className="absolute top-2 right-2 text-gray-300 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        <div>
                                            <label className={labelCls}>Degree</label>
                                            <input className={inputCls} value={ed.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} placeholder="B.Tech in Computer Science" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Institution</label>
                                            <input className={inputCls} value={ed.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} placeholder="University Name" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className={labelCls}>Duration</label>
                                                <input className={inputCls} value={ed.duration} onChange={e => updateEducation(i, 'duration', e.target.value)} placeholder="2020 - 2024" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Description</label>
                                            <textarea className={textareaCls} rows={2} value={ed.description} onChange={e => updateEducation(i, 'description', e.target.value)} placeholder="GPA, achievements..." />
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addEducation} className="w-full py-2 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#5c52d2] border-2 border-dashed border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> Add Education
                                </button>
                            </>
                        )}

                        {/* EXPERIENCE TAB */}
                        {activeTab === 'experience' && (
                            <>
                                {data.experience.map((exp, i) => (
                                    <div key={i} className="p-3 bg-white rounded-xl border border-gray-100 space-y-2 relative">
                                        {data.experience.length > 1 && (
                                            <button onClick={() => removeExperience(i)} className="absolute top-2 right-2 text-gray-300 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        <div>
                                            <label className={labelCls}>Job Title</label>
                                            <input className={inputCls} value={exp.title} onChange={e => updateExperience(i, 'title', e.target.value)} placeholder="Software Engineer" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className={labelCls}>Company</label>
                                                <input className={inputCls} value={exp.organization} onChange={e => updateExperience(i, 'organization', e.target.value)} placeholder="Company Name" />
                                            </div>
                                            <div>
                                                <label className={labelCls}>Duration</label>
                                                <input className={inputCls} value={exp.duration} onChange={e => updateExperience(i, 'duration', e.target.value)} placeholder="2022 - Present" />
                                            </div>
                                        </div>
                                        <div>
                                            <label className={labelCls}>Bullet Points</label>
                                            {(exp.bullets || []).map((b, bi) => (
                                                <div key={bi} className="flex gap-1.5 mb-1.5">
                                                    <span className="text-[10px] text-gray-300 mt-2 font-bold">{bi + 1}.</span>
                                                    <input
                                                        className={inputCls + ' flex-1'}
                                                        value={b}
                                                        onChange={e => updateExperienceBullet(i, bi, e.target.value)}
                                                        placeholder="Describe achievement..."
                                                    />
                                                    <button onClick={() => removeExperienceBullet(i, bi)} className="text-gray-300 hover:text-red-400 mt-1 transition-colors">
                                                        <Trash2 className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button onClick={() => addExperienceBullet(i)} className="text-[10px] font-bold text-[#5c52d2] hover:underline flex items-center gap-1 mt-1">
                                                <Plus className="w-3 h-3" /> Add bullet
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addExperience} className="w-full py-2 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#5c52d2] border-2 border-dashed border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> Add Experience
                                </button>
                            </>
                        )}

                        {/* PROJECTS TAB */}
                        {activeTab === 'projects' && (
                            <>
                                {data.projects.map((proj, i) => (
                                    <div key={i} className="p-3 bg-white rounded-xl border border-gray-100 space-y-2 relative">
                                        {data.projects.length > 1 && (
                                            <button onClick={() => removeProject(i)} className="absolute top-2 right-2 text-gray-300 hover:text-red-400 transition-colors">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        <div>
                                            <label className={labelCls}>Project Name</label>
                                            <input className={inputCls} value={proj.name} onChange={e => updateProject(i, 'name', e.target.value)} placeholder="Project Name" />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Technologies</label>
                                            <input className={inputCls} value={proj.technologies} onChange={e => updateProject(i, 'technologies', e.target.value)} placeholder="React, Python, Firebase..." />
                                        </div>
                                        <div>
                                            <label className={labelCls}>Description</label>
                                            <textarea className={textareaCls} rows={3} value={proj.description} onChange={e => updateProject(i, 'description', e.target.value)} placeholder="What does this project do..." />
                                        </div>
                                    </div>
                                ))}
                                <button onClick={addProject} className="w-full py-2 flex items-center justify-center gap-1.5 text-[10px] font-bold text-[#5c52d2] border-2 border-dashed border-purple-200 rounded-xl hover:bg-purple-50 transition-colors">
                                    <Plus className="w-3.5 h-3.5" /> Add Project
                                </button>
                            </>
                        )}

                        {/* SKILLS TAB */}
                        {activeTab === 'skills' && (
                            <>
                                <div>
                                    <label className={labelCls}>Technical Skills</label>
                                    <textarea
                                        className={textareaCls}
                                        rows={3}
                                        value={data.skills.technical_skills.join(', ')}
                                        onChange={e => updateSkillCategory('technical_skills', e.target.value)}
                                        placeholder="JavaScript, Python, React..."
                                    />
                                    <p className="text-[9px] text-gray-300 mt-0.5">Separate with commas</p>
                                </div>
                                <div>
                                    <label className={labelCls}>Tools & Frameworks</label>
                                    <textarea
                                        className={textareaCls}
                                        rows={3}
                                        value={data.skills.tools.join(', ')}
                                        onChange={e => updateSkillCategory('tools', e.target.value)}
                                        placeholder="VS Code, Docker, Git..."
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>Soft Skills</label>
                                    <textarea
                                        className={textareaCls}
                                        rows={3}
                                        value={data.skills.soft_skills.join(', ')}
                                        onChange={e => updateSkillCategory('soft_skills', e.target.value)}
                                        placeholder="Leadership, Communication..."
                                    />
                                </div>
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
