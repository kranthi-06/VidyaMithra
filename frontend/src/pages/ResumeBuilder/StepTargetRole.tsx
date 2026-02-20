import { Target, Sparkles } from 'lucide-react';
import { SectionCard, FieldInput } from './components';
import type { ResumeData } from './types';

export function StepTargetRole({ data, onChange }: { data: ResumeData; onChange: (d: Partial<ResumeData>) => void }) {
    const roles = ['Software Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Data Scientist', 'Product Manager', 'UI/UX Designer', 'DevOps Engineer', 'Mobile Developer', 'Machine Learning Engineer'];
    return (
        <SectionCard icon={Target} title="What role are you targeting?" subtitle="This helps our AI tailor your resume for maximum ATS impact">
            <FieldInput label="Target Job Title" value={data.target_role} onChange={v => onChange({ target_role: v })} placeholder="e.g., Software Engineer, Product Manager..." />
            <div className="pt-4">
                <p className="text-xs font-black uppercase text-gray-400 mb-3 tracking-widest">Popular Roles</p>
                <div className="flex flex-wrap gap-2">
                    {roles.map(r => (
                        <button key={r} onClick={() => onChange({ target_role: r })}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest border transition-all cursor-pointer ${data.target_role === r ? 'bg-[#5c52d2] text-white border-[#5c52d2] shadow-lg shadow-purple-100' : 'bg-purple-50 text-[#5c52d2] border-purple-100 hover:bg-purple-100'}`}>
                            {data.target_role === r ? '✓ ' : '+ '}{r}
                        </button>
                    ))}
                </div>
            </div>
            <div className="mt-6 p-5 bg-purple-50/60 rounded-[2rem] border border-purple-100 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-[#5c52d2] flex-shrink-0 mt-0.5" />
                <div>
                    <h4 className="text-sm font-bold text-gray-800">AI-Powered Optimization</h4>
                    <p className="text-xs text-gray-500 mt-1">Every section will be tailored with ATS keywords and professional language optimized for your target role.</p>
                </div>
            </div>
        </SectionCard>
    );
}
