import { useState } from 'react';
import { GraduationCap, PlusCircle, Trash2 } from 'lucide-react';
import { SectionCard, FieldInput, FieldTextarea, AIButton } from './components';
import { enhanceEducation } from '../../services/resumeBuilder';
import type { ResumeData, EducationItem } from './types';

const empty: EducationItem = { degree: '', institution: '', duration: '', description: '' };

export function StepEducation({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const [aiLoading, setAiLoading] = useState(false);
    const [enhanced, setEnhanced] = useState(false);
    const items = data.education;
    const setItem = (idx: number, field: keyof EducationItem, val: string) => {
        const n = [...items]; n[idx] = { ...n[idx], [field]: val }; onChange({ education: n });
    };
    const add = () => onChange({ education: [...items, { ...empty }] });
    const remove = (i: number) => items.length > 1 && onChange({ education: items.filter((_, idx) => idx !== i) });

    const handleEnhance = async () => {
        setAiLoading(true);
        try {
            const result = await enhanceEducation({ items, target_role: data.target_role });
            if (result.items) { onChange({ education: result.items }); setEnhanced(true); }
        } catch (e) { console.error(e); }
        setAiLoading(false);
    };

    return (
        <SectionCard icon={GraduationCap} title="Education" subtitle="Add your degrees and certifications">
            {items.map((edu, i) => (
                <div key={i} className="p-6 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-4 relative">
                    {items.length > 1 && (
                        <button onClick={() => remove(i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    )}
                    <div className="grid md:grid-cols-2 gap-4">
                        <FieldInput label="Degree" value={edu.degree} onChange={v => setItem(i, 'degree', v)} placeholder="B.S. in Computer Science" />
                        <FieldInput label="Institution" value={edu.institution} onChange={v => setItem(i, 'institution', v)} placeholder="University Name" />
                        <FieldInput label="Duration" value={edu.duration} onChange={v => setItem(i, 'duration', v)} placeholder="2020 - 2024" />
                    </div>
                    <FieldTextarea label="Additional Notes (coursework, honors)" value={edu.description} onChange={v => setItem(i, 'description', v)} placeholder="Relevant coursework, honors, GPA..." rows={2} />
                </div>
            ))}
            <button onClick={add} className="w-full h-14 border-2 border-dashed border-indigo-100 rounded-2xl flex items-center justify-center gap-2 text-indigo-400 font-bold hover:bg-indigo-50/50 transition-all text-sm">
                <PlusCircle className="w-5 h-5" /> Add Education
            </button>
            <div className="flex items-center justify-between">
                <AIButton onClick={handleEnhance} loading={aiLoading} />
                {enhanced && <span className="text-xs font-bold text-emerald-600">✅ AI Enhanced</span>}
            </div>
        </SectionCard>
    );
}
