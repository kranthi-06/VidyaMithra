import type { ResumeData } from '../types';

interface TemplateProps { data: ResumeData; accentColor?: string; }

export function CompactTemplate({ data, accentColor = '#334155' }: TemplateProps) {
    const p = data.personal;
    return (
        <div className="bg-white w-full min-h-[1122px] px-8 py-6" style={{ fontFamily: "'Arial', sans-serif", color: '#1f2937', fontSize: '10px' }}>
            <div className="text-center pb-2 mb-3" style={{ borderBottom: `1.5px solid ${accentColor}` }}>
                <h1 className="text-lg font-bold tracking-wide" style={{ color: accentColor }}>{p.full_name || 'YOUR NAME'}</h1>
                <div className="flex flex-wrap justify-center gap-1.5 mt-1 text-[9px] text-gray-500">
                    {p.email && <span>{p.email}</span>}{p.phone && <span>• {p.phone}</span>}{p.location && <span>• {p.location}</span>}
                </div>
            </div>
            {p.professional_summary && (
                <div className="mb-2">
                    <h2 className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accentColor }}>Summary</h2>
                    <p className="text-[9.5px] text-gray-600 leading-[1.5]">{p.professional_summary}</p>
                </div>
            )}
            {data.experience.some(e => e.title) && (
                <div className="mb-2">
                    <h2 className="text-[9px] font-bold uppercase tracking-wider mb-1" style={{ color: accentColor }}>Experience</h2>
                    {data.experience.filter(e => e.title).map((exp, i) => (
                        <div key={i} className="mb-1.5">
                            <div className="flex justify-between"><span className="text-[10px] font-bold">{exp.title} — {exp.organization}</span><span className="text-[8.5px] text-gray-400">{exp.duration}</span></div>
                            {exp.bullets?.length ? <ul className="pl-3 mt-0.5">{exp.bullets.map((b, bi) => <li key={bi} className="text-[9.5px] text-gray-600 leading-[1.4] list-disc">{b}</li>)}</ul> : exp.description && <p className="text-[9.5px] text-gray-600">{exp.description}</p>}
                        </div>
                    ))}
                </div>
            )}
            {(data.skills.technical_skills.length > 0 || data.skills.tools.length > 0) && (
                <div className="mb-2">
                    <h2 className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accentColor }}>Skills</h2>
                    <p className="text-[9.5px] text-gray-600">{[...data.skills.technical_skills, ...data.skills.tools, ...data.skills.soft_skills].join(' • ')}</p>
                </div>
            )}
            {data.education.some(e => e.degree) && (
                <div className="mb-2">
                    <h2 className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accentColor }}>Education</h2>
                    {data.education.filter(e => e.degree).map((ed, i) => (
                        <div key={i} className="flex justify-between"><span className="text-[10px] font-bold">{ed.degree} — {ed.institution}</span><span className="text-[8.5px] text-gray-400">{ed.duration}</span></div>
                    ))}
                </div>
            )}
            {data.projects.some(p => p.name) && (
                <div className="mb-2">
                    <h2 className="text-[9px] font-bold uppercase tracking-wider mb-0.5" style={{ color: accentColor }}>Projects</h2>
                    {data.projects.filter(p => p.name).map((proj, i) => (
                        <div key={i} className="mb-1"><span className="text-[10px] font-bold">{proj.name}</span>{proj.technologies && <span className="text-[8.5px] text-gray-400 ml-1">({proj.technologies})</span>}{proj.description && <p className="text-[9.5px] text-gray-600">{proj.description}</p>}</div>
                    ))}
                </div>
            )}
        </div>
    );
}
