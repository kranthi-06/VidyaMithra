import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Palette, Download, FileText, FileType2, Eye, Sparkles,
    CheckCircle2, Loader2, Wand2, PanelRightOpen, PanelRightClose,
    LayoutGrid, List
} from 'lucide-react';
import { SectionCard } from './components';
import {
    ModernTemplate, ClassicTemplate, CreativeTemplate, DeveloperTemplate,
    MinimalATSTemplate, AcademicTemplate, ExecutiveTemplate, TwoColumnTemplate, PortfolioTemplate,
    TEMPLATES, THEME_COLORS
} from './templates';
import type { TemplateId, TemplateConfig } from './templates';
import type { ResumeData } from './types';
import { exportToPDF, exportToDOCX } from './exportUtils';
import { optimizeResumeContent } from '../../services/resumeBuilder';
import { SidePanelEditor } from './SidePanelEditor';

interface StepVisualBuilderProps {
    data: ResumeData;
    onChange: (d: Partial<ResumeData>) => void;
}

/* Mini preview thumbnails for the template picker */
function TemplateThumbnail({ tmpl, color }: { tmpl: TemplateConfig; color: string }) {
    const id = tmpl.id;
    if (id === 'developer') return <div className="text-[6px] text-green-400 font-mono bg-[#0d1117] w-full h-full rounded-lg flex items-center justify-center">{'{ code }'}</div>;
    if (id === 'creative' || id === 'portfolio') return (
        <div className="w-full h-full rounded-lg overflow-hidden">
            <div className="h-5 w-full" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} />
            <div className="flex h-11"><div className="w-1/3 bg-gray-50" /><div className="w-2/3 p-1.5"><div className="h-0.5 w-6 bg-gray-200 rounded" /><div className="h-0.5 w-4 bg-gray-100 rounded mt-1" /></div></div>
        </div>
    );
    if (id === 'classic' || id === 'minimal-ats') return (
        <div className="w-full h-full rounded-lg flex flex-col items-center justify-center gap-0.5">
            <div className="text-[7px] font-bold uppercase tracking-widest text-gray-600">Name</div>
            <div className="w-10 h-px bg-gray-800" />
            <div className="w-8 h-0.5 bg-gray-200 rounded mt-1" />
        </div>
    );
    if (id === 'academic') return (
        <div className="w-full h-full rounded-lg flex flex-col items-center justify-center gap-0.5">
            <div className="text-[7px] font-bold" style={{ color }}>Name</div>
            <div className="w-10 h-px" style={{ borderTop: `1px double ${color}` }} />
        </div>
    );
    if (id === 'executive') return (
        <div className="w-full h-full rounded-lg overflow-hidden">
            <div className="h-6 w-full flex items-center px-2" style={{ backgroundColor: color }}><div className="text-[6px] text-white font-bold">EXEC</div></div>
            <div className="h-0.5 w-full" style={{ background: `linear-gradient(90deg, ${color}, #b8860b, ${color})` }} />
            <div className="p-1.5"><div className="h-0.5 w-6 bg-gray-200 rounded" /></div>
        </div>
    );
    if (id === 'two-column') return (
        <div className="w-full h-full rounded-lg overflow-hidden flex">
            <div className="w-2/5 h-full" style={{ backgroundColor: color }}><div className="p-1"><div className="h-0.5 w-5 bg-white/40 rounded mt-1" /></div></div>
            <div className="w-3/5 p-1.5"><div className="h-0.5 w-6 bg-gray-200 rounded" /><div className="h-0.5 w-4 bg-gray-100 rounded mt-1" /></div>
        </div>
    );
    /* modern (default) */
    return (
        <div className="flex w-full h-full rounded-lg overflow-hidden">
            <div className="w-1/3 h-full" style={{ backgroundColor: `${color}10` }} />
            <div className="w-2/3 p-1.5"><div className="h-0.5 w-6 rounded" style={{ backgroundColor: color }} /><div className="h-0.5 w-8 bg-gray-100 rounded mt-1" /></div>
        </div>
    );
}

export function StepVisualBuilder({ data, onChange }: StepVisualBuilderProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern');
    const [selectedColor, setSelectedColor] = useState('#5c52d2');
    const [exporting, setExporting] = useState<string | null>(null);
    const [optimizing, setOptimizing] = useState(false);
    const [optimized, setOptimized] = useState(false);
    const [previewScale, setPreviewScale] = useState(0.55);
    const [showPanel, setShowPanel] = useState(true);
    const [templateView, setTemplateView] = useState<'grid' | 'list'>('grid');
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
            case 'minimal-ats': return <MinimalATSTemplate {...props} />;
            case 'academic': return <AcademicTemplate {...props} />;
            case 'executive': return <ExecutiveTemplate {...props} />;
            case 'two-column': return <TwoColumnTemplate {...props} />;
            case 'portfolio': return <PortfolioTemplate {...props} />;
            default: return <ModernTemplate {...props} />;
        }
    };

    const currentTmpl = TEMPLATES.find(t => t.id === selectedTemplate);

    return (
        <SectionCard icon={Palette} title="Visual Resume Studio" subtitle="Choose template • Edit content • Preview live • Download">
            <div className="space-y-6">

                {/* ── TEMPLATE SELECTOR ── */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Choose Template</h3>
                        <div className="flex items-center gap-3">
                            {/* View Toggle */}
                            <div className="flex items-center gap-0.5 bg-gray-100 rounded-lg p-0.5">
                                <button onClick={() => setTemplateView('grid')} className={`p-1.5 rounded-md transition-all ${templateView === 'grid' ? 'bg-white shadow-sm text-[#5c52d2]' : 'text-gray-400'}`}>
                                    <LayoutGrid className="w-3 h-3" />
                                </button>
                                <button onClick={() => setTemplateView('list')} className={`p-1.5 rounded-md transition-all ${templateView === 'list' ? 'bg-white shadow-sm text-[#5c52d2]' : 'text-gray-400'}`}>
                                    <List className="w-3 h-3" />
                                </button>
                            </div>
                            {/* Color Picker */}
                            <div className="flex items-center gap-1">
                                {THEME_COLORS.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setSelectedColor(theme.color)}
                                        className={`w-6 h-6 rounded-lg transition-all flex items-center justify-center ${selectedColor === theme.color ? 'ring-2 ring-offset-1 ring-gray-300 scale-110' : 'hover:scale-105 opacity-60 hover:opacity-100'}`}
                                        style={{ backgroundColor: theme.color }}
                                        title={theme.label}
                                    >
                                        {selectedColor === theme.color && <CheckCircle2 className="w-3 h-3 text-white" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {templateView === 'grid' ? (
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-2">
                            {TEMPLATES.map(tmpl => (
                                <motion.button
                                    key={tmpl.id}
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    onClick={() => { setSelectedTemplate(tmpl.id); setOptimized(false); }}
                                    className={`relative p-3 rounded-xl border-2 text-left transition-all ${selectedTemplate === tmpl.id
                                            ? 'border-[#5c52d2] bg-purple-50/50 shadow-lg'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                        }`}
                                >
                                    {selectedTemplate === tmpl.id && (
                                        <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#5c52d2] rounded-full flex items-center justify-center shadow-md z-10">
                                            <CheckCircle2 className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                    <div className={`w-full h-16 rounded-lg mb-2 border border-gray-100 overflow-hidden ${tmpl.previewBg}`}>
                                        <TemplateThumbnail tmpl={tmpl} color={selectedColor} />
                                    </div>
                                    <p className="text-[10px] font-bold text-gray-800 truncate">{tmpl.name}</p>
                                    <div className="flex items-center gap-1 mt-0.5">
                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${tmpl.ats_priority === 'high' ? 'bg-emerald-50 text-emerald-600' :
                                                tmpl.ats_priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-gray-50 text-gray-400'
                                            }`}>ATS: {tmpl.ats_priority}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-1.5">
                            {TEMPLATES.map(tmpl => (
                                <motion.button
                                    key={tmpl.id}
                                    whileTap={{ scale: 0.99 }}
                                    onClick={() => { setSelectedTemplate(tmpl.id); setOptimized(false); }}
                                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl border-2 text-left transition-all ${selectedTemplate === tmpl.id
                                            ? 'border-[#5c52d2] bg-purple-50/50'
                                            : 'border-gray-100 hover:border-gray-200 bg-white'
                                        }`}
                                >
                                    <div className={`w-10 h-10 rounded-lg border border-gray-100 overflow-hidden flex-shrink-0 ${tmpl.previewBg}`}>
                                        <TemplateThumbnail tmpl={tmpl} color={selectedColor} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-gray-800">{tmpl.name}</p>
                                        <p className="text-[9px] text-gray-400 truncate">{tmpl.description}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                                        <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-md ${tmpl.ats_priority === 'high' ? 'bg-emerald-50 text-emerald-600' :
                                                tmpl.ats_priority === 'medium' ? 'bg-amber-50 text-amber-600' :
                                                    'bg-gray-50 text-gray-400'
                                            }`}>ATS: {tmpl.ats_priority}</span>
                                        <span className="text-[8px] text-gray-300">{tmpl.layout_type}</span>
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                    )}

                    {/* Current template info badge */}
                    {currentTmpl && (
                        <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 rounded-xl text-[10px] text-gray-400 font-medium">
                            <span><span className="font-bold text-gray-600">Template:</span> {currentTmpl.name}</span>
                            <span><span className="font-bold text-gray-600">Layout:</span> {currentTmpl.layout_type}</span>
                            <span><span className="font-bold text-gray-600">Focus:</span> {currentTmpl.emphasis}</span>
                            <span><span className="font-bold text-gray-600">ATS:</span> {currentTmpl.ats_priority}</span>
                        </div>
                    )}
                </div>

                {/* ── AI OPTIMIZER BAR ── */}
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

                {/* ── LIVE PREVIEW + SIDE PANEL ── */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Eye className="w-4 h-4 text-[#5c52d2]" />
                            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Live Preview & Editor</h3>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Panel Toggle */}
                            <motion.button
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setShowPanel(!showPanel)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${showPanel
                                        ? 'bg-[#5c52d2] text-white shadow-md'
                                        : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                    }`}
                            >
                                {showPanel ? <PanelRightClose className="w-3.5 h-3.5" /> : <PanelRightOpen className="w-3.5 h-3.5" />}
                                {showPanel ? 'Hide Editor' : 'Show Editor'}
                            </motion.button>
                            {/* Zoom */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-bold">Zoom:</span>
                                <input
                                    type="range"
                                    min="0.3"
                                    max="1"
                                    step="0.05"
                                    value={previewScale}
                                    onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                                    className="w-20 h-1 accent-[#5c52d2]"
                                />
                                <span className="text-[10px] font-bold text-gray-500 w-8">{Math.round(previewScale * 100)}%</span>
                            </div>
                        </div>
                    </div>

                    {/* Split Layout: Preview + Side Panel */}
                    <div className="flex gap-4">
                        {/* Preview Area */}
                        <div className={`bg-gray-100 rounded-2xl p-4 overflow-auto border border-gray-200 shadow-inner transition-all duration-300 ${showPanel ? 'flex-1 max-h-[750px]' : 'w-full max-h-[700px]'}`}>
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

                        {/* Side Panel Editor */}
                        <AnimatePresence>
                            {showPanel && (
                                <motion.div
                                    initial={{ width: 0, opacity: 0 }}
                                    animate={{ width: 360, opacity: 1 }}
                                    exit={{ width: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    className="overflow-hidden flex-shrink-0"
                                    style={{ height: '750px' }}
                                >
                                    <div className="w-[360px] h-full">
                                        <SidePanelEditor
                                            data={data}
                                            onChange={onChange}
                                            selectedTemplate={selectedTemplate}
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* ── EXPORT ACTIONS ── */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
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
