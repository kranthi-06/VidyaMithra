import type { ResumeData } from '../types';

interface TemplateProps {
    data: ResumeData;
    accentColor?: string;
}

export function AcademicTemplate({ data, accentColor = '#1e40af' }: TemplateProps) {
    const p = data.personal;
    return (
        <div className="bg-white w-full min-h-[1122px] px-10 py-9" style={{ fontFamily: "'Times New Roman', Georgia, serif", color: '#1f2937' }}>
            {/* Header — academic style */}
            <div className="text-center mb-1">
                <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{p.full_name || 'Your Name'}</h1>
                {data.target_role && <p className="text-sm text-gray-500 italic mt-0.5">{data.target_role}</p>}
            </div>
            <div className="flex flex-wrap justify-center gap-3 text-[10px] text-gray-500 pb-3 mb-5" style={{ borderBottom: `2px double ${accentColor}` }}>
                {p.email && <span>{p.email}</span>}
                {p.phone && <span>| {p.phone}</span>}
                {p.location && <span>| {p.location}</span>}
            </div>

            {/* Objective / Summary */}
            {p.professional_summary && (
                <div className="mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}40` }}>Career Objective</h2>
                    <p className="text-[11px] text-gray-700 leading-[1.8] italic">{p.professional_summary}</p>
                </div>
            )}

            {/* Education — prioritized first for students */}
            {data.education.some(e => e.degree) && (
                <div className="mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}40` }}>Education</h2>
                    <div className="space-y-3">
                        {data.education.filter(e => e.degree).map((ed, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <div>
                                        <span className="text-xs font-bold text-gray-900">{ed.degree}</span>
                                    </div>
                                    <span className="text-[10px] text-gray-500 italic">{ed.duration}</span>
                                </div>
                                <p className="text-[11px] text-gray-600 italic">{ed.institution}</p>
                                {ed.description && <p className="text-[11px] text-gray-600 mt-1">{ed.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects — important for students */}
            {data.projects.some(p => p.name) && (
                <div className="mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}40` }}>Academic Projects</h2>
                    <div className="space-y-3">
                        {data.projects.filter(p => p.name).map((proj, i) => (
                            <div key={i}>
                                <p className="text-xs font-bold text-gray-900">{proj.name}</p>
                                {proj.technologies && <p className="text-[10px] italic" style={{ color: accentColor }}>{proj.technologies}</p>}
                                {proj.description && <p className="text-[11px] text-gray-700 leading-[1.7] mt-1">{proj.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {data.experience.some(e => e.title) && (
                <div className="mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}40` }}>Experience / Internships</h2>
                    <div className="space-y-3">
                        {data.experience.filter(e => e.title).map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <span className="text-xs font-bold text-gray-900">{exp.title}</span>
                                    <span className="text-[10px] text-gray-500 italic">{exp.duration}</span>
                                </div>
                                <p className="text-[11px] text-gray-600 italic">{exp.organization}</p>
                                {exp.bullets && exp.bullets.length > 0 ? (
                                    <ul className="mt-1.5 space-y-0.5 pl-4">
                                        {exp.bullets.map((b, bi) => (
                                            <li key={bi} className="text-[11px] text-gray-700 leading-[1.6] list-disc">{b}</li>
                                        ))}
                                    </ul>
                                ) : exp.description ? (
                                    <p className="text-[11px] text-gray-700 mt-1">{exp.description}</p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {(data.skills.technical_skills.length > 0 || data.skills.tools.length > 0 || data.skills.soft_skills.length > 0) && (
                <div className="mb-5">
                    <h2 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor, borderBottom: `1px solid ${accentColor}40` }}>Skills & Competencies</h2>
                    <div className="grid grid-cols-3 gap-2">
                        {[...data.skills.technical_skills, ...data.skills.tools, ...data.skills.soft_skills].map((s, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full" style={{ backgroundColor: accentColor }} />
                                <span className="text-[11px] text-gray-700">{s}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
