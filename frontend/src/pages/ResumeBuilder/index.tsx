import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { Stepper } from './components';
import { StepTargetRole } from './StepTargetRole';
import { StepPersonalInfo } from './StepPersonalInfo';
import { StepEducation } from './StepEducation';
import { StepExperience } from './StepExperience';
import { StepProjects } from './StepProjects';
import { StepSkills } from './StepSkills';
import { StepATSPreview } from './StepATSPreview';
import type { BuilderStep, ResumeData } from './types';
import { defaultResumeData } from './types';

export default function ResumeBuilderPage() {
    const [step, setStep] = useState<BuilderStep>(1);
    const [data, setData] = useState<ResumeData>({ ...defaultResumeData });

    const update = (partial: Partial<ResumeData>) => setData(prev => ({ ...prev, ...partial }));
    const next = () => step < 7 && setStep((step + 1) as BuilderStep);
    const prev = () => step > 1 && setStep((step - 1) as BuilderStep);

    const canProceed = () => {
        if (step === 1) return data.target_role.trim().length > 0;
        return true;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
            {/* Header */}
            <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-gray-900 tracking-tight">AI Resume Architect</h1>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Step {step} of 7</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 bg-indigo-50 px-3 py-1.5 rounded-xl">
                        <Sparkles className="w-3.5 h-3.5" /> AI-Powered
                    </div>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                <Stepper current={step} />

                <AnimatePresence mode="wait">
                    <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}
                        className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8 md:p-12">
                        {step === 1 && <StepTargetRole data={data} onChange={update} />}
                        {step === 2 && <StepPersonalInfo data={data} onChange={update} />}
                        {step === 3 && <StepEducation data={data} onChange={update} />}
                        {step === 4 && <StepExperience data={data} onChange={update} />}
                        {step === 5 && <StepProjects data={data} onChange={update} />}
                        {step === 6 && <StepSkills data={data} onChange={update} />}
                        {step === 7 && <StepATSPreview data={data} onChange={update} />}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-8">
                    <button onClick={prev} disabled={step === 1}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
                        <ArrowLeft className="w-4 h-4" /> Previous
                    </button>
                    {step < 7 ? (
                        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={next} disabled={!canProceed()}
                            className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-2xl font-bold text-sm shadow-xl shadow-indigo-200 hover:shadow-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-all">
                            Next Step <ArrowRight className="w-4 h-4" />
                        </motion.button>
                    ) : (
                        <div className="text-xs text-gray-400 font-medium">Download your resume from above ↑</div>
                    )}
                </div>
            </div>
        </div>
    );
}
