import type { ResumeData } from '../types';

interface TemplateProps {
    data: ResumeData;
    accentColor?: string;
}

export function ModernTemplate({ data, accentColor = '#5c52d2' }: TemplateProps) {
    const p = data.personal;
    return (
        <div className="bg-white w-full min-h-[1122px] font-sans" style={{ fontFamily: "'Inter', 'Segoe UI', sans-serif" }}>
            {/* Header */}
            <div className="px-10 pt-10 pb-6" style={{ borderBottom: `3px solid ${accentColor}` }}>
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{p.full_name || 'Your Name'}</h1>
                <p className="text-sm font-bold mt-1" style={{ color: accentColor }}>{data.target_role || 'Professional Title'}</p>
                <div className="flex flex-wrap gap-4 mt-3 text-xs text-gray-500 font-medium">
                    {p.email && <span>✉ {p.email}</span>}
                    {p.phone && <span>📱 {p.phone}</span>}
                    {p.location && <span>📍 {p.location}</span>}
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-[32%] p-8 space-y-7" style={{ backgroundColor: `${accentColor}08` }}>
                    {/* Skills */}
                    {(data.skills.technical_skills.length > 0 || data.skills.tools.length > 0) && (
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Technical Skills</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {data.skills.technical_skills.map((s, i) => (
                                    <span key={i} className="px-2 py-1 text-[10px] font-bold rounded-md border bg-white text-gray-700" style={{ borderColor: `${accentColor}30` }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.skills.tools.length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Tools & Frameworks</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {data.skills.tools.map((s, i) => (
                                    <span key={i} className="px-2 py-1 text-[10px] font-bold rounded-md border bg-white text-gray-700" style={{ borderColor: `${accentColor}30` }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {data.skills.soft_skills.length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Soft Skills</h3>
                            <div className="flex flex-wrap gap-1.5">
                                {data.skills.soft_skills.map((s, i) => (
                                    <span key={i} className="px-2 py-1 text-[10px] font-bold rounded-md border bg-white text-gray-600" style={{ borderColor: `${accentColor}20` }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                    {/* Education */}
                    {data.education.some(e => e.degree) && (
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Education</h3>
                            <div className="space-y-3">
                                {data.education.filter(e => e.degree).map((ed, i) => (
                                    <div key={i}>
                                        <p className="text-xs font-bold text-gray-800">{ed.degree}</p>
                                        <p className="text-[10px] text-gray-500 font-medium">{ed.institution}</p>
                                        <p className="text-[10px] text-gray-400">{ed.duration}</p>
                                        {ed.description && <p className="text-[10px] text-gray-500 mt-1">{ed.description}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="w-[68%] p-8 space-y-7">
                    {/* Professional Summary */}
                    {p.professional_summary && (
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-3" style={{ color: accentColor }}>Professional Summary</h3>
                            <p className="text-xs text-gray-600 leading-relaxed font-medium">{p.professional_summary}</p>
                        </div>
                    )}

                    {/* Experience */}
                    {data.experience.some(e => e.title) && (
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>Professional Experience</h3>
                            <div className="space-y-5">
                                {data.experience.filter(e => e.title).map((exp, i) => (
                                    <div key={i} className="pl-4" style={{ borderLeft: `2px solid ${accentColor}30` }}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-bold text-gray-900">{exp.title}</p>
                                                <p className="text-xs text-gray-500 font-medium">{exp.organization}</p>
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 whitespace-nowrap ml-4">{exp.duration}</span>
                                        </div>
                                        {exp.bullets && exp.bullets.length > 0 ? (
                                            <ul className="mt-2 space-y-1">
                                                {exp.bullets.map((b, bi) => (
                                                    <li key={bi} className="text-xs text-gray-600 leading-relaxed flex gap-2">
                                                        <span style={{ color: accentColor }} className="mt-0.5 flex-shrink-0">•</span>
                                                        <span>{b}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : exp.description ? (
                                            <p className="text-xs text-gray-600 leading-relaxed mt-2">{exp.description}</p>
                                        ) : null}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Projects */}
                    {data.projects.some(p => p.name) && (
                        <div>
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4" style={{ color: accentColor }}>Projects</h3>
                            <div className="space-y-4">
                                {data.projects.filter(p => p.name).map((proj, i) => (
                                    <div key={i}>
                                        <div className="flex justify-between items-start">
                                            <p className="text-sm font-bold text-gray-900">{proj.name}</p>
                                        </div>
                                        {proj.technologies && (
                                            <p className="text-[10px] font-bold mt-0.5" style={{ color: accentColor }}>{proj.technologies}</p>
                                        )}
                                        {proj.description && (
                                            <p className="text-xs text-gray-600 leading-relaxed mt-1">{proj.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
