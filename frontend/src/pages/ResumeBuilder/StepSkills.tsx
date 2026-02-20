import { useState } from 'react';
import { Wrench, Plus, X } from 'lucide-react';
import { SectionCard, FieldTextarea, AIButton } from './components';
import { enhanceSkills } from '../../services/resumeBuilder';
import type { ResumeData } from './types';

function SkillChip({ label, onRemove, color = 'indigo' }: { label: string; onRemove: () => void; color?: string }) {
    const colors: Record<string, string> = {
        indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
        blue: 'bg-blue-50 text-blue-700 border-blue-200',
        green: 'bg-green-50 text-green-700 border-green-200',
        yellow: 'bg-amber-50 text-amber-700 border-amber-200',
    };
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${colors[color]} transition-all`}>
            {label}
            <button onClick={onRemove} className="hover:opacity-60"><X className="w-3 h-3" /></button>
        </span>
    );
}

export function StepSkills({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const [aiLoading, setAiLoading] = useState(false);
    const [enhanced, setEnhanced] = useState(false);
    const s = data.skills;
    const setSkills = (partial: Partial<typeof s>) => onChange({ skills: { ...s, ...partial } });

    const addSuggested = (skill: string) => {
        setSkills({
            technical_skills: [...s.technical_skills, skill],
            suggested_skills: s.suggested_skills.filter(x => x !== skill),
        });
    };
    const removeTech = (i: number) => setSkills({ technical_skills: s.technical_skills.filter((_, idx) => idx !== i) });
    const removeTool = (i: number) => setSkills({ tools: s.tools.filter((_, idx) => idx !== i) });
    const removeSoft = (i: number) => setSkills({ soft_skills: s.soft_skills.filter((_, idx) => idx !== i) });

    const handleEnhance = async () => {
        setAiLoading(true);
        try {
            const result = await enhanceSkills({ raw_skills: s.raw_skills, target_role: data.target_role });
            if (!result.error) {
                setSkills({
                    technical_skills: result.technical_skills || s.technical_skills,
                    tools: result.tools || s.tools,
                    soft_skills: result.soft_skills || s.soft_skills,
                    suggested_skills: result.suggested_skills || [],
                });
                setEnhanced(true);
            }
        } catch (e) { console.error(e); }
        setAiLoading(false);
    };

    return (
        <SectionCard icon={Wrench} title="Skills" subtitle="List your skills — AI will categorize them">
            <FieldTextarea label="Paste all your skills (comma or line-separated)" value={s.raw_skills} onChange={v => setSkills({ raw_skills: v })} placeholder="React, Python, FastAPI, Docker, Leadership, Communication..." rows={3} />
            <AIButton onClick={handleEnhance} loading={aiLoading} label={enhanced ? 'Re-categorize' : 'Categorize with AI'} />

            {enhanced && (
                <div className="space-y-6 mt-4">
                    {s.technical_skills.length > 0 && (
                        <div><p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Technical Skills</p>
                            <div className="flex flex-wrap gap-2">{s.technical_skills.map((sk, i) => <SkillChip key={i} label={sk} onRemove={() => removeTech(i)} color="indigo" />)}</div></div>
                    )}
                    {s.tools.length > 0 && (
                        <div><p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Tools & Frameworks</p>
                            <div className="flex flex-wrap gap-2">{s.tools.map((sk, i) => <SkillChip key={i} label={sk} onRemove={() => removeTool(i)} color="blue" />)}</div></div>
                    )}
                    {s.soft_skills.length > 0 && (
                        <div><p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-2">Soft Skills</p>
                            <div className="flex flex-wrap gap-2">{s.soft_skills.map((sk, i) => <SkillChip key={i} label={sk} onRemove={() => removeSoft(i)} color="green" />)}</div></div>
                    )}
                    {s.suggested_skills.length > 0 && (
                        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                            <p className="text-[10px] font-black uppercase text-amber-600 tracking-widest mb-2">🤖 AI Suggested (click to add)</p>
                            <div className="flex flex-wrap gap-2">{s.suggested_skills.map((sk, i) => (
                                <button key={i} onClick={() => addSuggested(sk)} className="px-3 py-1.5 bg-white border border-amber-200 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-100 flex items-center gap-1"><Plus className="w-3 h-3" />{sk}</button>
                            ))}</div>
                        </div>
                    )}
                </div>
            )}
        </SectionCard>
    );
}
