import type { ResumeData } from '../types';

interface TemplateProps {
    data: ResumeData;
    accentColor?: string;
}

export function ClassicTemplate({ data, accentColor = '#1a1a2e' }: TemplateProps) {
    const p = data.personal;
    return (
        <div className="bg-white w-full min-h-[1122px] font-serif px-12 py-10" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
            {/* Header - Centered Classic */}
            <div className="text-center pb-5 mb-6" style={{ borderBottom: `2px solid ${accentColor}` }}>
                <h1 className="text-3xl font-bold tracking-widest uppercase text-gray-900" style={{ letterSpacing: '0.15em' }}>
                    {p.full_name || 'YOUR NAME'}
                </h1>
                <p className="text-sm font-medium text-gray-500 mt-2 tracking-wider uppercase">{data.target_role || 'Professional Title'}</p>
                <div className="flex flex-wrap justify-center gap-3 mt-3 text-[11px] text-gray-500">
                    {p.email && <span>{p.email}</span>}
                    {p.email && p.phone && <span>|</span>}
                    {p.phone && <span>{p.phone}</span>}
                    {p.phone && p.location && <span>|</span>}
                    {p.location && <span>{p.location}</span>}
                </div>
            </div>

            {/* Professional Summary */}
            {p.professional_summary && (
                <div className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900 pb-1 mb-3" style={{ borderBottom: `1px solid ${accentColor}` }}>Professional Summary</h2>
                    <p className="text-xs text-gray-600 leading-[1.8]">{p.professional_summary}</p>
                </div>
            )}

            {/* Experience */}
            {data.experience.some(e => e.title) && (
                <div className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900 pb-1 mb-3" style={{ borderBottom: `1px solid ${accentColor}` }}>Professional Experience</h2>
                    <div className="space-y-5">
                        {data.experience.filter(e => e.title).map((exp, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <p className="text-sm font-bold text-gray-900">{exp.title}</p>
                                    <span className="text-[10px] text-gray-500 italic">{exp.duration}</span>
                                </div>
                                <p className="text-xs text-gray-500 italic">{exp.organization}</p>
                                {exp.bullets && exp.bullets.length > 0 ? (
                                    <ul className="mt-2 space-y-1 pl-4">
                                        {exp.bullets.map((b, bi) => (
                                            <li key={bi} className="text-xs text-gray-600 leading-relaxed list-disc">{b}</li>
                                        ))}
                                    </ul>
                                ) : exp.description ? (
                                    <p className="text-xs text-gray-600 leading-relaxed mt-1">{exp.description}</p>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Education */}
            {data.education.some(e => e.degree) && (
                <div className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900 pb-1 mb-3" style={{ borderBottom: `1px solid ${accentColor}` }}>Education</h2>
                    <div className="space-y-3">
                        {data.education.filter(e => e.degree).map((ed, i) => (
                            <div key={i}>
                                <div className="flex justify-between items-baseline">
                                    <p className="text-sm font-bold text-gray-900">{ed.degree}</p>
                                    <span className="text-[10px] text-gray-500 italic">{ed.duration}</span>
                                </div>
                                <p className="text-xs text-gray-500 italic">{ed.institution}</p>
                                {ed.description && <p className="text-xs text-gray-600 mt-1">{ed.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {data.projects.some(p => p.name) && (
                <div className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900 pb-1 mb-3" style={{ borderBottom: `1px solid ${accentColor}` }}>Projects</h2>
                    <div className="space-y-3">
                        {data.projects.filter(p => p.name).map((proj, i) => (
                            <div key={i}>
                                <p className="text-sm font-bold text-gray-900">{proj.name}</p>
                                {proj.technologies && <p className="text-[10px] italic text-gray-500">{proj.technologies}</p>}
                                {proj.description && <p className="text-xs text-gray-600 leading-relaxed mt-1">{proj.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Skills */}
            {(data.skills.technical_skills.length > 0 || data.skills.tools.length > 0 || data.skills.soft_skills.length > 0) && (
                <div className="mb-6">
                    <h2 className="text-xs font-bold uppercase tracking-[0.25em] text-gray-900 pb-1 mb-3" style={{ borderBottom: `1px solid ${accentColor}` }}>Technical Skills</h2>
                    <div className="space-y-2">
                        {data.skills.technical_skills.length > 0 && (
                            <p className="text-xs text-gray-600"><span className="font-bold text-gray-800">Languages & Technologies:</span> {data.skills.technical_skills.join(', ')}</p>
                        )}
                        {data.skills.tools.length > 0 && (
                            <p className="text-xs text-gray-600"><span className="font-bold text-gray-800">Tools & Frameworks:</span> {data.skills.tools.join(', ')}</p>
                        )}
                        {data.skills.soft_skills.length > 0 && (
                            <p className="text-xs text-gray-600"><span className="font-bold text-gray-800">Soft Skills:</span> {data.skills.soft_skills.join(', ')}</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
