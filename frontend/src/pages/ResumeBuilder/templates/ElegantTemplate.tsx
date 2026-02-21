import type { ResumeData } from '../types';

interface TemplateProps { data: ResumeData; accentColor?: string; }

export function ElegantTemplate({ data, accentColor = '#78716c' }: TemplateProps) {
    const p = data.personal;
    return (
        <div className="bg-white w-full min-h-[1122px] px-14 py-12" style={{ fontFamily: "'Georgia', serif", color: '#44403c' }}>
            <div className="text-center mb-8">
                <h1 className="text-2xl font-normal tracking-[0.3em] uppercase" style={{ color: accentColor }}>{p.full_name || 'Your Name'}</h1>
                <div className="w-16 h-px mx-auto mt-3 mb-2" style={{ backgroundColor: accentColor }} />
                <p className="text-[10px] tracking-[0.15em] text-gray-400 uppercase">{data.target_role}</p>
                <div className="flex justify-center gap-4 mt-3 text-[10px] text-gray-400">
                    {p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}
                </div>
            </div>
            {p.professional_summary && (
                <div className="mb-8 text-center max-w-lg mx-auto">
                    <p className="text-[11px] text-gray-500 leading-[2] italic">{p.professional_summary}</p>
                </div>
            )}
            {data.experience.some(e => e.title) && (
                <div className="mb-8">
                    <h2 className="text-[10px] font-normal uppercase tracking-[0.3em] text-center mb-4" style={{ color: accentColor }}>Experience</h2>
                    <div className="space-y-5">
                        {data.experience.filter(e => e.title).map((exp, i) => (
                            <div key={i} className="text-center">
                                <p className="text-xs font-bold text-gray-800">{exp.title}</p>
                                <p className="text-[10px] italic text-gray-500">{exp.organization} · {exp.duration}</p>
                                {exp.bullets?.length ? (
                                    <ul className="mt-2 space-y-0.5">{exp.bullets.map((b, bi) => <li key={bi} className="text-[10px] text-gray-500 leading-[1.7]">{b}</li>)}</ul>
                                ) : exp.description && <p className="text-[10px] text-gray-500 mt-1">{exp.description}</p>}
                            </div>
                        ))}
                    </div>
                </div>
            )}
            {data.education.some(e => e.degree) && (
                <div className="mb-8">
                    <h2 className="text-[10px] font-normal uppercase tracking-[0.3em] text-center mb-4" style={{ color: accentColor }}>Education</h2>
                    {data.education.filter(e => e.degree).map((ed, i) => (
                        <div key={i} className="text-center mb-2">
                            <p className="text-xs font-bold text-gray-800">{ed.degree}</p>
                            <p className="text-[10px] italic text-gray-500">{ed.institution} · {ed.duration}</p>
                        </div>
                    ))}
                </div>
            )}
            {data.projects.some(p => p.name) && (
                <div className="mb-8">
                    <h2 className="text-[10px] font-normal uppercase tracking-[0.3em] text-center mb-4" style={{ color: accentColor }}>Projects</h2>
                    {data.projects.filter(p => p.name).map((proj, i) => (
                        <div key={i} className="text-center mb-2">
                            <p className="text-xs font-bold text-gray-800">{proj.name}</p>
                            {proj.technologies && <p className="text-[9px] italic" style={{ color: accentColor }}>{proj.technologies}</p>}
                            {proj.description && <p className="text-[10px] text-gray-500 mt-0.5">{proj.description}</p>}
                        </div>
                    ))}
                </div>
            )}
            {(data.skills.technical_skills.length > 0 || data.skills.tools.length > 0) && (
                <div className="text-center">
                    <h2 className="text-[10px] font-normal uppercase tracking-[0.3em] mb-3" style={{ color: accentColor }}>Skills</h2>
                    <p className="text-[10px] text-gray-500 tracking-wide">{[...data.skills.technical_skills, ...data.skills.tools, ...data.skills.soft_skills].join('  ·  ')}</p>
                </div>
            )}
        </div>
    );
}
