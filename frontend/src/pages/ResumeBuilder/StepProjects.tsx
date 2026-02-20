import { useState } from 'react';
import { Laptop, PlusCircle, Trash2 } from 'lucide-react';
import { SectionCard, FieldInput, FieldTextarea, AIButton } from './components';
import { enhanceProjects } from '../../services/resumeBuilder';
import type { ResumeData, ProjectItem } from './types';

const empty: ProjectItem = { name: '', technologies: '', description: '' };

export function StepProjects({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const [aiLoading, setAiLoading] = useState(false);
    const [enhanced, setEnhanced] = useState(false);
    const items = data.projects;
    const setItem = (idx: number, field: keyof ProjectItem, val: string) => {
        const n = [...items]; n[idx] = { ...n[idx], [field]: val }; onChange({ projects: n });
    };
    const add = () => onChange({ projects: [...items, { ...empty }] });
    const remove = (i: number) => items.length > 1 && onChange({ projects: items.filter((_, idx) => idx !== i) });

    const handleEnhance = async () => {
        setAiLoading(true);
        try {
            const result = await enhanceProjects({ items, target_role: data.target_role });
            if (result.items) {
                onChange({ projects: result.items.map((it: any) => ({ ...it, technologies: Array.isArray(it.technologies) ? it.technologies.join(', ') : it.technologies })) });
                setEnhanced(true);
            }
        } catch (e) { console.error(e); }
        setAiLoading(false);
    };

    return (
        <SectionCard icon={Laptop} title="Projects" subtitle="Showcase your best work">
            {items.map((proj, i) => (
                <div key={i} className="p-6 bg-gray-50/80 rounded-2xl border border-gray-100 space-y-4 relative">
                    {items.length > 1 && (
                        <button onClick={() => remove(i)} className="absolute top-4 right-4 text-gray-300 hover:text-red-400 transition-colors"><Trash2 className="w-4 h-4" /></button>
                    )}
                    <FieldInput label="Project Name" value={proj.name} onChange={v => setItem(i, 'name', v)} placeholder="AI Resume Builder" />
                    <FieldInput label="Technologies Used" value={proj.technologies} onChange={v => setItem(i, 'technologies', v)} placeholder="React, Python, FastAPI, OpenAI" />
                    <FieldTextarea label="Description (raw - AI will polish it)" value={proj.description} onChange={v => setItem(i, 'description', v)} placeholder="Describe what you built and what problem it solves..." rows={3} />
                </div>
            ))}
            <button onClick={add} className="w-full h-14 border-2 border-dashed border-indigo-100 rounded-2xl flex items-center justify-center gap-2 text-indigo-400 font-bold hover:bg-indigo-50/50 transition-all text-sm">
                <PlusCircle className="w-5 h-5" /> Add Project
            </button>
            <div className="flex items-center justify-between">
                <AIButton onClick={handleEnhance} loading={aiLoading} />
                {enhanced && <span className="text-xs font-bold text-emerald-600">✅ AI Enhanced</span>}
            </div>
        </SectionCard>
    );
}
