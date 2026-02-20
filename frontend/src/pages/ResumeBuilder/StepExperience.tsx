import { useState } from 'react';
import { Briefcase, PlusCircle, Trash2 } from 'lucide-react';
import { SectionCard, FieldInput, FieldTextarea, AIButton, RegenerateBar } from './components';
import { enhanceExperience, regenerateSection } from '../../services/resumeBuilder';
import type { ResumeData, ExperienceItem } from './types';

const empty: ExperienceItem = { title: '', organization: '', duration: '', description: '', bullets: [] };

export function StepExperience({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const [aiLoading, setAiLoading] = useState(false);
    const [enhanced, setEnhanced] = useState(false);
    const items = data.experience;
    const setItem = (idx: number, field: keyof ExperienceItem, val: any) => {
        const n = [...items]; n[idx] = { ...n[idx], [field]: val }; onChange({ experience: n });
    };
    const add = () => onChange({ experience: [...items, { ...empty }] });
    const remove = (i: number) => items.length > 1 && onChange({ experience: items.filter((_, idx) => idx !== i) });

    const handleEnhance = async () => {
        setAiLoading(true);
        try {
            const result = await enhanceExperience({ items, target_role: data.target_role });
            if (result.items) { onChange({ experience: result.items }); setEnhanced(true); }
        } catch (e) { console.error(e); }
        setAiLoading(false);
    };

    const handleRegen = async (mode: string) => {
        setAiLoading(true);
        try {
            const result = await regenerateSection({ section_data: { section: 'experience', items }, mode, target_role: data.target_role });
            if (result.items) onChange({ experience: result.items });
        } catch (e) { console.error(e); }
        setAiLoading(false);
    };

    return (
        <SectionCard icon={Briefcase} title="Experience" subtitle="Jobs, internships, or academic work">
            {items.map((exp, i) => (
                <div key={i} className="p-6 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-4 relative">
                    {items.length > 1 && (
                        <button onClick={() => remove(i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                        <FieldInput label="Job Title" value={exp.title} onChange={v => setItem(i, 'title', v)} placeholder="Software Engineer" />
                        <FieldInput label="Company / Organization" value={exp.organization} onChange={v => setItem(i, 'organization', v)} placeholder="Tech Corp" />
                        <FieldInput label="Duration" value={exp.duration} onChange={v => setItem(i, 'duration', v)} placeholder="Jan 2022 - Present" />
                    </div>
                    <FieldTextarea label="Description (raw text - AI will create bullet points)" value={exp.description} onChange={v => setItem(i, 'description', v)} placeholder="Write roughly what you did... AI will rewrite into professional bullet points with action verbs." rows={4} />
                    {exp.bullets && exp.bullets.length > 0 && (
                        <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest mb-2">✨ AI-Generated Bullets</p>
                            <ul className="space-y-1.5">
                                {exp.bullets.map((b, bi) => (
                                    <li key={bi} className="text-sm text-gray-700 font-medium flex gap-2">
                                        <span className="text-emerald-500 mt-0.5">•</span>
                                        <input value={b} onChange={e => { const nb = [...exp.bullets]; nb[bi] = e.target.value; setItem(i, 'bullets', nb); }}
                                            className="flex-1 bg-transparent outline-none border-b border-transparent hover:border-gray-200 focus:border-indigo-300 transition-colors" />
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
            <button onClick={add} className="w-full h-14 border-2 border-dashed border-indigo-100 rounded-2xl flex items-center justify-center gap-2 text-indigo-400 font-bold hover:bg-indigo-50/50 transition-all text-sm">
                <PlusCircle className="w-5 h-5" /> Add Experience
            </button>
            <div className="flex items-center justify-between">
                <AIButton onClick={handleEnhance} loading={aiLoading} />
                {enhanced && <span className="text-xs font-bold text-emerald-600">✅ AI Enhanced</span>}
            </div>
            {enhanced && <RegenerateBar onRegenerate={handleRegen} loading={aiLoading} />}
        </SectionCard>
    );
}
