import type { ResumeData } from '../types';

interface TemplateProps { data: ResumeData; accentColor?: string; }

export function TimelineTemplate({ data, accentColor = '#6366f1' }: TemplateProps) {
    const p = data.personal;
    const allEntries = [
        ...data.experience.filter(e => e.title).map(e => ({ type: 'exp' as const, title: e.title, sub: e.organization, duration: e.duration, desc: e.bullets?.join(' • ') || e.description || '' })),
        ...data.education.filter(e => e.degree).map(e => ({ type: 'edu' as const, title: e.degree, sub: e.institution, duration: e.duration, desc: e.description || '' })),
        ...data.projects.filter(p => p.name).map(p => ({ type: 'proj' as const, title: p.name, sub: p.technologies || '', duration: '', desc: p.description || '' })),
    ];
    return (
        <div className="bg-white w-full min-h-[1122px] px-10 py-9" style={{ fontFamily: "'Inter', sans-serif", color: '#1f2937' }}>
            <div className="mb-6">
                <h1 className="text-2xl font-black" style={{ color: accentColor }}>{p.full_name || 'Your Name'}</h1>
                {data.target_role && <p className="text-xs text-gray-500 mt-0.5">{data.target_role}</p>}
                <div className="flex gap-3 mt-2 text-[10px] text-gray-400">
                    {p.email && <span>{p.email}</span>}{p.phone && <span>{p.phone}</span>}{p.location && <span>{p.location}</span>}
                </div>
                {p.professional_summary && <p className="text-[11px] text-gray-600 leading-[1.7] mt-3 border-l-3 pl-4" style={{ borderLeftColor: accentColor }}>{p.professional_summary}</p>}
            </div>
            {/* Skills bar */}
            {data.skills.technical_skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-6">
                    {[...data.skills.technical_skills, ...data.skills.tools].map((s, i) => (
                        <span key={i} className="px-2.5 py-1 text-[9px] font-bold rounded-full text-white" style={{ backgroundColor: accentColor }}>{s}</span>
                    ))}
                </div>
            )}
            {/* Timeline */}
            <div className="relative pl-8">
                <div className="absolute left-3 top-0 bottom-0 w-0.5" style={{ backgroundColor: `${accentColor}30` }} />
                {allEntries.map((entry, i) => (
                    <div key={i} className="relative mb-6">
                        <div className="absolute -left-5 top-1 w-4 h-4 rounded-full border-2 bg-white" style={{ borderColor: accentColor, backgroundColor: i === 0 ? accentColor : 'white' }} />
                        <span className={`text-[8px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${entry.type === 'exp' ? 'bg-blue-50 text-blue-600' : entry.type === 'edu' ? 'bg-emerald-50 text-emerald-600' : 'bg-purple-50 text-purple-600'}`}>
                            {entry.type === 'exp' ? 'Experience' : entry.type === 'edu' ? 'Education' : 'Project'}
                        </span>
                        <h3 className="text-xs font-bold text-gray-900 mt-1">{entry.title}</h3>
                        <div className="flex justify-between items-baseline">
                            <p className="text-[10px]" style={{ color: accentColor }}>{entry.sub}</p>
                            {entry.duration && <span className="text-[9px] text-gray-400">{entry.duration}</span>}
                        </div>
                        {entry.desc && <p className="text-[10px] text-gray-600 leading-[1.6] mt-1">{entry.desc}</p>}
                    </div>
                ))}
            </div>
        </div>
    );
}
