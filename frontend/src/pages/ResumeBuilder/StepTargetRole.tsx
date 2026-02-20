import { Target, Sparkles } from 'lucide-react';
import { SectionCard, FieldInput } from './components';
import type { ResumeData } from './types';

export function StepTargetRole({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Product Manager', 'UI/UX Designer', 'DevOps Engineer', 'Mobile Developer', 'Machine Learning Engineer'];
    return (
        <SectionCard icon={Target} title="What role are you targeting?" subtitle="This helps our AI tailor your resume for maximum ATS impact">
            <FieldInput label="Target Job Title" value={data.target_role} onChange={v => onChange({ target_role: v })} placeholder="e.g., Software Engineer, Product Manager..." />
            <div className="pt-4">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Popular Roles</p>
                <div className="flex flex-wrap gap-2">
                    {roles.map(r => (
                        <button key={r} onClick={() => onChange({ target_role: r })}
                            className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${data.target_role === r ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg shadow-indigo-200' : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300 hover:bg-indigo-50'}`}>
                            {r}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mt-6 p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-indigo-500 flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-indigo-900">AI-Powered Optimization</h4>
                    <p className="text-xs text-indigo-600/80 mt-1">Every section will be tailored with ATS keywords and professional language optimized for your target role.</p>
                </div>
            </div>
        </SectionCard>
    );
}
