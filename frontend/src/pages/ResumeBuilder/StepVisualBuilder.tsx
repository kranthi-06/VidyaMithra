import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Palette, Download, FileText, FileType2, Eye, Sparkles,
    CheckCircle2, Loader2, ChevronDown, RotateCcw, Wand2
} from 'lucide-react';
import { SectionCard } from './components';
import { ModernTemplate, ClassicTemplate, CreativeTemplate, DeveloperTemplate, TEMPLATES, THEME_COLORS } from './templates';
import type { TemplateId } from './templates';
import type { ResumeData } from './types';
import { exportToPDF, exportToDOCX } from './exportUtils';
import { optimizeResumeContent } from '../../services/resumeBuilder';

interface StepVisualBuilderProps {
    data: ResumeData;
    onChange: (d: Partial<ResumeData>) => void;
}

export function StepVisualBuilder({ data, onChange }: StepVisualBuilderProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
    const [selectedColor, setSelectedColor] = useState('#5c52d2');
    const [exporting, setExporting] = useState<string | null>(null);
    const [optimizing, setOptimizing] = useState(false);
    const [optimized, setOptimized] = useState(false);
    const [showExportMenu, setShowExportMenu] = useState(false);
    const [previewScale, setPreviewScale] = useState(0.65);
    const previewRef = useRef<HTMLDivElement>(null);

    const handleOptimize = async () => {
        setOptimizing(true);
        try {
            const result = await optimizeResumeContent({
                resume_data: {
                    personal: data.personal,
                    education: data.education,
                    experience: data.experience,
                    projects: data.projects,
                    skills: {
                        technical_skills: data.skills.technical_skills,
                        tools: data.skills.tools,
                        soft_skills: data.skills.soft_skills,
                    },
                },
                target_role: data.target_role,
                template_style: selectedTemplate,
            });
            if (result && !result.error) {
                // Apply AI optimized content while keeping structure
                if (result.personal) {
                    onChange({ personal: { ...data.personal, ...result.personal } });
                }
                if (result.experience) {
                    onChange({ experience: result.experience });
                }
                if (result.projects) {
                    onChange({ projects: result.projects });
                }
                setOptimized(true);
            }
        } catch (e) {
            console.error('Optimization error:', e);
        }
        setOptimizing(false);
    };

    const handleExportPDF = async () => {
        setExporting('pdf');
        try {
            const name = data.personal.full_name?.replace(/\s+/g, '_') || 'resume';
            await exportToPDF('resume-preview-container', `${name}_Resume.pdf`);
        } catch (e) {
            console.error('PDF export error:', e);
        }
        setExporting(null);
        setShowExportMenu(false);
    };

    const handleExportDOCX = async () => {
        setExporting('docx');
        try {
            const name = data.personal.full_name?.replace(/\s+/g, '_') || 'resume';
            await exportToDOCX(data, `${name}_Resume.docx`);
        } catch (e) {
            console.error('DOCX export error:', e);
        }
        setExporting(null);
        setShowExportMenu(false);
    };

    const handleDownloadJSON = () => {
        const output = {
            meta: { generated_at: new Date().toISOString(), target_role: data.target_role, template: selectedTemplate, ats_score: data.ats?.score },
            personal_info: data.personal,
            education: data.education,
            experience: data.experience,
            projects: data.projects,
            skills: { technical_skills: data.skills.technical_skills, tools: data.skills.tools, soft_skills: data.skills.soft_skills },
        };
        const blob = new Blob([JSON.stringify(output, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `resume-${Date.now()}.json`; a.click();
        URL.revokeObjectURL(url);
    };

    const renderTemplate = () => {
        const props = { data, accentColor: selectedColor };
        switch (selectedTemplate) {
            case 'modern': return <ModernTemplate {...props} />;
            case 'classic': return <ClassicTemplate {...props} />;
            case 'creative': return <CreativeTemplate {...props} />;
            case 'developer': return <DeveloperTemplate {...props} />;
            default: return <ModernTemplate {...props} />;
        }
    };

    return (
        <SectionCard icon={Palette} title="Visual Resume Studio" subtitle="Choose a template, preview your resume, and download">
            <div className="space-y-8">

                {/* Template Selection */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Choose Template</h3>
                        <div className="flex items-center gap-1">
                            {THEME_COLORS.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => setSelectedColor(theme.color)}
                                    className={`w-7 h-7 rounded-lg transition-all flex items-center justify-center ${selectedColor === theme.color ? 'ring-2 ring-offset-2 ring-gray-300 scale-110' : 'hover:scale-105 opacity-70 hover:opacity-100'}`}
                                    style={{ backgroundColor: theme.color }}
                                    title={theme.label}
                                >
                                    {selectedColor === theme.color && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {TEMPLATES.map(tmpl => (
                            <motion.button
                                key={tmpl.id}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => { setSelectedTemplate(tmpl.id); setOptimized(false); }}
                                className={`relative p-4 rounded-2xl border-2 text-left transition-all ${selectedTemplate === tmpl.id
                                        ? 'border-[#5c52d2] bg-purple-50/50 shadow-lg'
                                        : 'border-gray-100 hover:border-gray-200 bg-white'
                                    }`}
                            >
                                {selectedTemplate === tmpl.id && (
                                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-[#5c52d2] rounded-full flex items-center justify-center shadow-md">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                                    </div>
                                )}
                                <div className={`w-full h-16 rounded-xl mb-3 flex items-center justify-center ${tmpl.previewBg} border border-gray-100 overflow-hidden`}>
                                    {tmpl.id === 'developer' ? (
                                        <div className="text-[6px] text-green-400 font-mono">{'{ code }'}</div>
                                    ) : tmpl.id === 'creative' ? (
                                        <div className="w-full h-full">
                                            <div className="h-4 w-full rounded-t-xl" style={{ backgroundColor: selectedColor }} />
                                            <div className="flex h-12"><div className="w-1/3 bg-gray-50" /><div className="w-2/3" /></div>
                                        </div>
                                    ) : tmpl.id === 'classic' ? (
                                        <div className="text-center">
                                            <div className="text-[8px] font-bold uppercase tracking-widest">Name</div>
                                            <div className="w-12 h-px bg-gray-900 mx-auto mt-1" />
                                        </div>
                                    ) : (
                                        <div className="flex w-full h-full">
                                            <div className="w-1/3 h-full" style={{ backgroundColor: `${selectedColor}10` }} />
                                            <div className="w-2/3 p-2"><div className="h-1 w-8 rounded" style={{ backgroundColor: selectedColor }} /></div>
                                        </div>
                                    )}
                                </div>
                                <p className="text-xs font-bold text-gray-900">{tmpl.name}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{tmpl.badge}</p>
                            </motion.button>
                        ))}
                    </div>
                </div>

                {/* AI Optimization Bar */}
                <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100">
                    <Wand2 className="w-5 h-5 text-[#5c52d2]" />
                    <div className="flex-1 min-w-[200px]">
                        <p className="text-xs font-bold text-gray-800">AI Content Optimizer</p>
                        <p className="text-[10px] text-gray-400">Enhance wording for the selected template style</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleOptimize}
                        disabled={optimizing}
                        className="px-5 py-2.5 bg-gradient-to-r from-[#5c52d2] to-[#7c3aed] text-white rounded-xl font-bold text-xs shadow-lg shadow-purple-200 hover:shadow-xl transition-all disabled:opacity-60 flex items-center gap-2"
                    >
                        {optimizing ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Optimizing...</>
                        ) : optimized ? (
                            <><CheckCircle2 className="w-4 h-4" /> Re-optimize</>
                        ) : (
                            <><Sparkles className="w-4 h-4" /> Optimize Content</>
                        )}
                    </motion.button>
                    {optimized && (
                        <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> AI Enhanced
                        </span>
                    )}
                </div>

                {/* Live Preview */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-[#5c52d2]" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Live Preview</h3>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-bold">Zoom:</span>
                            <input
                                type="range"
                                min="0.35"
                                max="1"
                                step="0.05"
                                value={previewScale}
                                onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                                className="w-20 h-1 accent-[#5c52d2]"
                            />
                            <span className="text-[10px] font-bold text-gray-500 w-8">{Math.round(previewScale * 100)}%</span>
                        </div>
                    </div>

                    <div className="bg-gray-100 rounded-2xl p-6 overflow-auto max-h-[700px] border border-gray-200 shadow-inner">
                        <div
                            className="mx-auto shadow-2xl border border-gray-200 rounded-lg overflow-hidden"
                            style={{
                                width: `${794 * previewScale}px`,
                                transformOrigin: 'top center',
                            }}
                        >
                            <div
                                id="resume-preview-container"
                                ref={previewRef}
                                style={{
                                    width: '794px',
                                    transform: `scale(${previewScale})`,
                                    transformOrigin: 'top left',
                                }}
                            >
                                {renderTemplate()}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Export Actions */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    {/* PDF Download */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExportPDF}
                        disabled={!!exporting}
                        className="px-8 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 hover:shadow-xl transition-all disabled:opacity-60 flex items-center gap-2.5"
                    >
                        {exporting === 'pdf' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</>
                        ) : (
                            <><FileText className="w-4 h-4" /> Download PDF</>
                        )}
                    </motion.button>

                    {/* DOCX Download */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleExportDOCX}
                        disabled={!!exporting}
                        className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-60 flex items-center gap-2.5"
                    >
                        {exporting === 'docx' ? (
                            <><Loader2 className="w-4 h-4 animate-spin" /> Generating DOCX...</>
                        ) : (
                            <><FileType2 className="w-4 h-4" /> Download DOCX</>
                        )}
                    </motion.button>

                    {/* JSON Download (preserved) */}
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleDownloadJSON}
                        className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2.5"
                    >
                        <Download className="w-4 h-4" /> Download JSON
                    </motion.button>
                </div>

                <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    JSON data is your single source of truth • Templates are visual presentation only
                </p>
            </div>
        </SectionCard>
    );
}
