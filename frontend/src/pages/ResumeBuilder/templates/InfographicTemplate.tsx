import type { ResumeData } from '../types';

interface TemplateProps { data: ResumeData; accentColor?: string; }

export function InfographicTemplate({ data, accentColor = '#0891b2' }: TemplateProps) {
    const p = data.personal;
    const allSkills = [...data.skills.technical_skills, ...data.skills.tools];
    return (
        <div className="bg-white w-full min-h-[1122px] flex" style={{ fontFamily: "'Inter', sans-serif", color: '#1f2937' }}>
            {/* Left: Infographic sidebar */}
            <div className="w-[35%] p-6 text-white" style={{ backgroundColor: accentColor }}>
                <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl font-black mb-4 border-2 border-white/30">
                    {(p.full_name || 'U').charAt(0)}
                </div>
                <h1 className="text-lg font-black">{p.full_name || 'Your Name'}</h1>
                <p className="text-[10px] opacity-80 font-bold mt-0.5">{data.target_role}</p>
                <div className="mt-4 space-y-1.5 text-[10px] opacity-90">
                    {p.email && <p>✉ {p.email}</p>}{p.phone && <p>📱 {p.phone}</p>}{p.location && <p>📍 {p.location}</p>}
                </div>
                {/* Skill Bars */}
                {allSkills.length > 0 && (
                    <div className="mt-6">
                        <h3 className="text-[9px] font-black uppercase tracking-wider opacity-70 mb-2">Skills</h3>
                        <div className="space-y-2">
                            {allSkills.slice(0, 10).map((s, i) => {
                                const pct = 70 + (i * 7 + 11) % 30;
                                return (
                                    <div key={i}>
                                        <div className="flex justify-between text-[9px] mb-0.5"><span className="font-bold">{s}</span><span className="opacity-60">{pct}%</span></div>
                                        <div className="w-full h-1.5 bg-white/20 rounded-full"><div className="h-full bg-white/80 rounded-full" style={{ width: `${pct}%` }} /></div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}
                {data.skills.soft_skills.length > 0 && (
                    <div className="mt-5">
                        <h3 className="text-[9px] font-black uppercase tracking-wider opacity-70 mb-2">Soft Skills</h3>
                        <div className="flex flex-wrap gap-1">{data.skills.soft_skills.map((s, i) => <span key={i} className="px-2 py-0.5 text-[8px] font-bold rounded bg-white/20">{s}</span>)}</div>
                    </div>
                )}
                {data.education.some(e => e.degree) && (
                    <div className="mt-5">
                        <h3 className="text-[9px] font-black uppercase tracking-wider opacity-70 mb-2">Education</h3>
                        {data.education.filter(e => e.degree).map((ed, i) => (
                            <div key={i} className="mb-2"><p className="text-[10px] font-bold">{ed.degree}</p><p className="text-[9px] opacity-70">{ed.institution}</p><p className="text-[8px] opacity-50">{ed.duration}</p></div>
                        ))}
                    </div>
                )}
            </div>
            {/* Right: Content */}
            <div className="w-[65%] p-7 space-y-5">
                {p.professional_summary && (
                    <div><h2 className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: accentColor }}>About</h2><p className="text-[11px] text-gray-600 leading-[1.8]">{p.professional_summary}</p></div>
                )}
                {data.experience.some(e => e.title) && (
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-wider mb-3" style={{ color: accentColor }}>Experience</h2>
                        {data.experience.filter(e => e.title).map((exp, i) => (
                            <div key={i} className="mb-4">
                                <div className="flex justify-between"><span className="text-xs font-bold">{exp.title}</span><span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>{exp.duration}</span></div>
                                <p className="text-[10px]" style={{ color: accentColor }}>{exp.organization}</p>
                                {exp.bullets?.length ? <ul className="mt-1 space-y-0.5 pl-3">{exp.bullets.map((b, bi) => <li key={bi} className="text-[10px] text-gray-600 leading-[1.6] list-disc">{b}</li>)}</ul> : exp.description && <p className="text-[10px] text-gray-600 mt-1">{exp.description}</p>}
                            </div>
                        ))}
                    </div>
                )}
                {data.projects.some(p => p.name) && (
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-wider mb-2" style={{ color: accentColor }}>Projects</h2>
                        <div className="grid grid-cols-2 gap-2">
                            {data.projects.filter(p => p.name).map((proj, i) => (
                                <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: `${accentColor}08`, border: `1px solid ${accentColor}20` }}>
                                    <p className="text-[10px] font-bold">{proj.name}</p>
                                    {proj.technologies && <p className="text-[8px] font-bold mt-0.5" style={{ color: accentColor }}>{proj.technologies}</p>}
                                    {proj.description && <p className="text-[9px] text-gray-500 mt-1">{proj.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
