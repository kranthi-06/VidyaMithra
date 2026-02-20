import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, FileText, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
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

interface AIBuilderProps {
    onBack: () => void;
}

export default function AIBuilder({ onBack }: AIBuilderProps) {
    const [step, setStep] = useState<BuilderStep>(1);
    const [data, setData] = useState<ResumeData>({ ...defaultResumeData });

    const update = (partial: Partial<ResumeData>) => setData(prev => ({ ...prev, ...partial }));
    const next = () => step < 7 && setStep((step + 1) as BuilderStep);
    const prev = () => step > 1 ? setStep((step - 1) as BuilderStep) : onBack();

    const canProceed = () => {
        if (step === 1) return data.target_role.trim().length > 0;
        return true;
    };

    return (
        <motion.div
            key="ai-builder"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="max-w-4xl mx-auto py-10"
        >
            {/* Header Bar */}
            <div className="bg-white/90 backdrop-blur-sm rounded-[2rem] shadow-xl p-6 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#5c52d2] to-[#7c3aed] rounded-xl flex items-center justify-center shadow-lg shadow-purple-200">
                        <FileText className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-gray-900 tracking-tight">AI Resume Architect</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Step {step} of 7</p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#5c52d2] bg-purple-50 px-3 py-1.5 rounded-xl">
                    <Sparkles className="w-3.5 h-3.5" /> AI-Powered
                </div>
            </div>

            <Stepper current={step} />

            <div className="bg-white/90 backdrop-blur-sm rounded-[3rem] shadow-2xl border border-white/50 p-8 md:p-12">
                <AnimatePresence mode="wait">
                    <motion.div key={step} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
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
                <div className="flex items-center justify-between mt-12 pt-12 border-t border-gray-50">
                    <Button
                        onClick={prev}
                        variant="ghost"
                        className="h-14 px-10 rounded-2xl font-black text-gray-400 hover:text-gray-600"
                    >
                        {step === 1 ? '← Back' : 'Previous'}
                    </Button>
                    {step < 7 ? (
                        <Button
                            onClick={next}
                            disabled={!canProceed()}
                            className="h-14 px-10 rounded-2xl bg-[#5c52d2] hover:bg-[#4b43b0] text-white font-black group gap-3 shadow-lg shadow-purple-100 disabled:opacity-40"
                        >
                            Next <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    ) : (
                        <div className="text-xs text-gray-400 font-medium">Download your resume above ↑</div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}
