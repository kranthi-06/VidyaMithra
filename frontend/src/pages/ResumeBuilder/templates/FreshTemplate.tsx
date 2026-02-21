import type { ResumeData } from '../types';

interface TemplateProps { data: ResumeData; accentColor?: string; }

export function FreshTemplate({ data, accentColor = '#06b6d4' }: TemplateProps) {
    const p = data.personal;
    return (
        <div className="bg-white w-full min-h-[1122px]" style={{ fontFamily: "'Inter', sans-serif", color: '#1f2937' }}>
            <div className="px-10 py-8" style={{ background: `linear-gradient(135deg, ${accentColor}12, ${accentColor}06, white)` }}>
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-xl font-black text-white" style={{ background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)` }}>
                        {(p.full_name || 'U').charAt(0)}
                    </div>
                    <div>
                        <h1 className="text-xl font-black" style={{ color: accentColor }}>{p.full_name || 'Your Name'}</h1>
                        <p className="text-[10px] text-gray-400 font-bold">{data.target_role} {p.location && `· ${p.location}`}</p>
                    </div>
                </div>
                <div className="flex gap-4 mt-3 text-[10px] text-gray-400">{p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}</div>
            </div>
            <div className="px-10 py-6 space-y-5">
                {p.professional_summary && (
                    <div className="p-4 rounded-2xl border" style={{ borderColor: `${accentColor}20`, background: `linear-gradient(135deg, ${accentColor}04, transparent)` }}>
                        <p className="text-[11px] text-gray-600 leading-[1.8]">{p.professional_summary}</p>
                    </div>
                )}
                {data.experience.some(e => e.title) && (
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                            <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} /> Experience
                        </h2>
                        {data.experience.filter(e => e.title).map((exp, i) => (
                            <div key={i} className="mb-4 pl-4" style={{ borderLeft: `2px solid ${accentColor}30` }}>
                                <div className="flex justify-between"><span className="text-xs font-bold">{exp.title}</span><span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${accentColor}10`, color: accentColor }}>{exp.duration}</span></div>
                                <p className="text-[10px] font-bold" style={{ color: accentColor }}>{exp.organization}</p>
                                {exp.bullets?.length ? <ul className="mt-1 pl-3 space-y-0.5">{exp.bullets.map((b, bi) => <li key={bi} className="text-[10px] text-gray-600 leading-[1.6] list-disc">{b}</li>)}</ul> : exp.description && <p className="text-[10px] text-gray-600 mt-1">{exp.description}</p>}
                            </div>
                        ))}
                    </div>
                )}
                {data.projects.some(p => p.name) && (
                    <div>
                        <h2 className="text-[10px] font-black uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: accentColor }}>
                            <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} /> Projects
                        </h2>
                        <div className="grid grid-cols-2 gap-2">
                            {data.projects.filter(p => p.name).map((proj, i) => (
                                <div key={i} className="p-3 rounded-xl" style={{ backgroundColor: `${accentColor}06` }}>
                                    <p className="text-[10px] font-bold">{proj.name}</p>
                                    {proj.technologies && <p className="text-[8px] mt-0.5" style={{ color: accentColor }}>{proj.technologies}</p>}
                                    {proj.description && <p className="text-[9px] text-gray-500 mt-1">{proj.description}</p>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-6">
                    {(data.skills.technical_skills.length > 0) && (
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                                <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} /> Skills
                            </h2>
                            <div className="flex flex-wrap gap-1.5">{[...data.skills.technical_skills, ...data.skills.tools].map((s, i) => <span key={i} className="px-2 py-0.5 text-[9px] font-bold rounded-lg" style={{ backgroundColor: `${accentColor}10`, color: accentColor }}>{s}</span>)}</div>
                        </div>
                    )}
                    {data.education.some(e => e.degree) && (
                        <div>
                            <h2 className="text-[10px] font-black uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: accentColor }}>
                                <div className="w-5 h-0.5 rounded-full" style={{ backgroundColor: accentColor }} /> Education
                            </h2>
                            {data.education.filter(e => e.degree).map((ed, i) => (
                                <div key={i} className="mb-1.5"><p className="text-xs font-bold">{ed.degree}</p><p className="text-[10px] text-gray-500">{ed.institution} · {ed.duration}</p></div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
