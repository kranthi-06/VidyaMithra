import type { ResumeData } from '../types';

interface TemplateProps { data: ResumeData; accentColor?: string; }

export function CorporateTemplate({ data, accentColor = '#1e3a5f' }: TemplateProps) {
    const p = data.personal;
    return (
        <div className="bg-white w-full min-h-[1122px]" style={{ fontFamily: "'Calibri', 'Segoe UI', sans-serif", color: '#1e293b' }}>
            <div className="px-10 py-6 flex justify-between items-end" style={{ backgroundColor: `${accentColor}08`, borderBottom: `3px solid ${accentColor}` }}>
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: accentColor }}>{p.full_name || 'YOUR NAME'}</h1>
                    <p className="text-xs text-gray-500 mt-0.5">{data.target_role}</p>
                </div>
                <div className="text-right text-[10px] text-gray-500 space-y-0.5">
                    {p.email && <p>{p.email}</p>}{p.phone && <p>{p.phone}</p>}{p.location && <p>{p.location}</p>}
                </div>
            </div>
            <div className="px-10 py-7 space-y-5">
                {p.professional_summary && (
                    <div className="p-4 rounded-lg" style={{ backgroundColor: `${accentColor}06`, borderLeft: `4px solid ${accentColor}` }}>
                        <p className="text-[11px] text-gray-600 leading-[1.8]">{p.professional_summary}</p>
                    </div>
                )}
                {data.experience.some(e => e.title) && (
                    <div>
                        <h2 className="text-xs font-bold uppercase pb-1 mb-3" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>Professional Experience</h2>
                        {data.experience.filter(e => e.title).map((exp, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between"><div><span className="text-xs font-bold">{exp.title}</span><span className="text-[10px] text-gray-500 ml-2">| {exp.organization}</span></div><span className="text-[10px] font-bold" style={{ color: accentColor }}>{exp.duration}</span></div>
                                {exp.bullets?.length ? <ul className="mt-1.5 pl-4 space-y-0.5">{exp.bullets.map((b, bi) => <li key={bi} className="text-[11px] text-gray-600 leading-[1.6] list-disc">{b}</li>)}</ul> : exp.description && <p className="text-[11px] text-gray-600 mt-1">{exp.description}</p>}
                            </div>
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-2 gap-6">
                    {data.education.some(e => e.degree) && (
                        <div>
                            <h2 className="text-xs font-bold uppercase pb-1 mb-2" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>Education</h2>
                            {data.education.filter(e => e.degree).map((ed, i) => (
                                <div key={i} className="mb-2"><p className="text-xs font-bold">{ed.degree}</p><p className="text-[10px] text-gray-500">{ed.institution} · {ed.duration}</p></div>
                            ))}
                        </div>
                    )}
                    {(data.skills.technical_skills.length > 0) && (
                        <div>
                            <h2 className="text-xs font-bold uppercase pb-1 mb-2" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>Core Competencies</h2>
                            <div className="flex flex-wrap gap-1.5">
                                {[...data.skills.technical_skills, ...data.skills.tools].map((s, i) => (
                                    <span key={i} className="px-2 py-0.5 text-[9px] font-bold rounded text-white" style={{ backgroundColor: accentColor }}>{s}</span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
                {data.projects.some(p => p.name) && (
                    <div>
                        <h2 className="text-xs font-bold uppercase pb-1 mb-2" style={{ color: accentColor, borderBottom: `2px solid ${accentColor}` }}>Key Projects</h2>
                        {data.projects.filter(p => p.name).map((proj, i) => (
                            <div key={i} className="mb-2"><span className="text-xs font-bold">{proj.name}</span>{proj.technologies && <span className="text-[9px] text-gray-400 ml-2">({proj.technologies})</span>}{proj.description && <p className="text-[11px] text-gray-600 mt-0.5">{proj.description}</p>}</div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
