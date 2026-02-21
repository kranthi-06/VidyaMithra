import { useState, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Palette, Download, FileText, FileType2, Eye, Sparkles,
    CheckCircle2, Loader2, Wand2, PanelRightOpen, PanelRightClose,
    ChevronDown, ChevronRight, Search, Filter, GripVertical
} from 'lucide-react';
import { SectionCard } from './components';
import {
    ModernTemplate, ClassicTemplate, CreativeTemplate, DeveloperTemplate,
    MinimalATSTemplate, AcademicTemplate, ExecutiveTemplate, TwoColumnTemplate,
    PortfolioTemplate, CompactTemplate, TimelineTemplate, ElegantTemplate,
    BoldHeaderTemplate, InfographicTemplate, CorporateTemplate, FreshTemplate,
    TEMPLATE_CATALOG, TEMPLATE_CATEGORIES, THEME_COLORS,
} from './templates';
import type { BaseTemplate, CatalogTemplate } from './templates';
import type { ResumeData } from './types';
import { exportToPDF, exportToDOCX } from './exportUtils';
import { optimizeResumeContent } from '../../services/resumeBuilder';
import { SidePanelEditor } from './SidePanelEditor';

interface StepVisualBuilderProps {
    data: ResumeData;
    onChange: (d: Partial<ResumeData>) => void;
}

/* Render the correct base template component */
function RenderTemplate({ base, data, color }: { base: BaseTemplate; data: ResumeData; color: string }) {
    const p = { data, accentColor: color };
    switch (base) {
        case 'modern': return <ModernTemplate {...p} />;
        case 'classic': return <ClassicTemplate {...p} />;
        case 'creative': return <CreativeTemplate {...p} />;
        case 'developer': return <DeveloperTemplate {...p} />;
        case 'minimal-ats': return <MinimalATSTemplate {...p} />;
        case 'academic': return <AcademicTemplate {...p} />;
        case 'executive': return <ExecutiveTemplate {...p} />;
        case 'two-column': return <TwoColumnTemplate {...p} />;
        case 'portfolio': return <PortfolioTemplate {...p} />;
        case 'compact': return <CompactTemplate {...p} />;
        case 'timeline': return <TimelineTemplate {...p} />;
        case 'elegant': return <ElegantTemplate {...p} />;
        case 'bold-header': return <BoldHeaderTemplate {...p} />;
        case 'infographic': return <InfographicTemplate {...p} />;
        case 'corporate': return <CorporateTemplate {...p} />;
        case 'fresh': return <FreshTemplate {...p} />;
        default: return <ModernTemplate {...p} />;
    }
}

/* Tiny thumbnail for template card */
function MiniThumb({ base, color }: { base: BaseTemplate; color: string }) {
    if (base === 'developer') return <div className="w-full h-full rounded bg-[#0d1117] flex items-center justify-center text-[5px] text-green-400 font-mono">{'{ }'}</div>;
    if (base === 'two-column' || base === 'infographic') return (
        <div className="w-full h-full rounded overflow-hidden flex"><div className="w-2/5 h-full" style={{ backgroundColor: color }} /><div className="w-3/5 p-1"><div className="h-0.5 w-4 bg-gray-200 rounded mt-0.5" /></div></div>
    );
    if (base === 'executive') return (
        <div className="w-full h-full rounded overflow-hidden"><div className="h-3 w-full" style={{ backgroundColor: color }} /><div className="h-px w-full" style={{ background: `linear-gradient(90deg, ${color}, #b8860b, ${color})` }} /><div className="p-0.5"><div className="h-0.5 w-4 bg-gray-200 rounded" /></div></div>
    );
    if (base === 'portfolio' || base === 'creative') return (
        <div className="w-full h-full rounded overflow-hidden"><div className="h-4 w-full" style={{ background: `linear-gradient(135deg, ${color}, ${color}88)` }} /><div className="p-0.5"><div className="h-0.5 w-3 bg-gray-200 rounded" /></div></div>
    );
    if (base === 'bold-header') return (
        <div className="w-full h-full rounded p-1"><div className="text-[6px] font-black" style={{ color }}> NAME</div><div className="h-0.5 w-3 mt-0.5 rounded" style={{ backgroundColor: color }} /></div>
    );
    if (base === 'timeline') return (
        <div className="w-full h-full rounded p-1 flex gap-1"><div className="flex flex-col items-center"><div className="w-1 h-1 rounded-full" style={{ backgroundColor: color }} /><div className="w-px flex-1" style={{ backgroundColor: `${color}40` }} /><div className="w-1 h-1 rounded-full border" style={{ borderColor: color }} /></div><div><div className="h-0.5 w-4 bg-gray-200 rounded" /><div className="h-0.5 w-3 bg-gray-100 rounded mt-1" /></div></div>
    );
    if (base === 'elegant') return (
        <div className="w-full h-full rounded flex flex-col items-center justify-center"><div className="text-[5px] tracking-widest uppercase" style={{ color }}>Name</div><div className="w-4 h-px mt-0.5" style={{ backgroundColor: color }} /></div>
    );
    if (base === 'compact') return (
        <div className="w-full h-full rounded p-0.5"><div className="text-center text-[5px] font-bold" style={{ color }}>NAME</div><div className="w-full h-px mt-0.5" style={{ backgroundColor: color }} /><div className="h-0.5 w-6 bg-gray-200 rounded mt-0.5 mx-auto" /></div>
    );
    if (base === 'fresh') return (
        <div className="w-full h-full rounded overflow-hidden" style={{ background: `linear-gradient(135deg, ${color}12, white)` }}><div className="p-1 flex items-center gap-0.5"><div className="w-2 h-2 rounded" style={{ backgroundColor: color }} /><div className="h-0.5 w-4 rounded" style={{ backgroundColor: color }} /></div></div>
    );
    if (base === 'corporate') return (
        <div className="w-full h-full rounded overflow-hidden"><div className="h-3 px-1 flex justify-between items-center" style={{ backgroundColor: `${color}08`, borderBottom: `1.5px solid ${color}` }}><div className="h-0.5 w-4 rounded" style={{ backgroundColor: color }} /><div className="h-0.5 w-2 bg-gray-300 rounded" /></div></div>
    );
    // modern/classic/minimal-ats defaults
    if (base === 'modern') return (
        <div className="w-full h-full rounded overflow-hidden flex"><div className="w-1/3 h-full" style={{ backgroundColor: `${color}10` }} /><div className="w-2/3 p-1"><div className="h-0.5 w-4 rounded" style={{ backgroundColor: color }} /></div></div>
    );
    return (
        <div className="w-full h-full rounded p-1"><div className="h-0.5 w-6 mx-auto rounded" style={{ backgroundColor: color }} /><div className="h-0.5 w-4 bg-gray-200 rounded mt-1 mx-auto" /></div>
    );
}

export function StepVisualBuilder({ data, onChange }: StepVisualBuilderProps) {
    const [selectedId, setSelectedId] = useState('ats-modern');
    const [customColor, setCustomColor] = useState<string | null>(null);
    const [exporting, setExporting] = useState<string | null>(null);
    const [optimizing, setOptimizing] = useState(false);
    const [optimized, setOptimized] = useState(false);
    const [previewScale, setPreviewScale] = useState(0.55);
    const [showPanel, setShowPanel] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedCats, setExpandedCats] = useState<Set<string>>(new Set(TEMPLATE_CATEGORIES));
    const previewRef = useRef<HTMLDivElement>(null);

    const selected = useMemo(() => TEMPLATE_CATALOG.find(t => t.template_id === selectedId) || TEMPLATE_CATALOG[0], [selectedId]);
    const accentColor = customColor || selected.default_color;

    // Filtered catalog
    const filteredCatalog = useMemo(() => {
        if (!searchQuery.trim()) return TEMPLATE_CATALOG;
        const q = searchQuery.toLowerCase();
        return TEMPLATE_CATALOG.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.category.toLowerCase().includes(q) ||
            t.recommended_for_roles.some(r => r.toLowerCase().includes(q)) ||
            t.ats_priority.includes(q) ||
            t.layout_type.includes(q)
        );
    }, [searchQuery]);

    const toggleCategory = (cat: string) => {
        setExpandedCats(prev => {
            const next = new Set(prev);
            next.has(cat) ? next.delete(cat) : next.add(cat);
            return next;
        });
    };

    const handleOptimize = async () => {
        setOptimizing(true);
        try {
            const result = await optimizeResumeContent({
                resume_data: {
                    personal: data.personal,
                    education: data.education,
                    experience: data.experience,
                    projects: data.projects,
                    skills: { technical_skills: data.skills.technical_skills, tools: data.skills.tools, soft_skills: data.skills.soft_skills },
                },
                target_role: data.target_role,
                template_style: selected.base,
            });
            if (result && !result.error) {
                if (result.personal) onChange({ personal: { ...data.personal, ...result.personal } });
                if (result.experience) onChange({ experience: result.experience });
                if (result.projects) onChange({ projects: result.projects });
                setOptimized(true);
            }
        } catch (e) { console.error('Optimization error:', e); }
        setOptimizing(false);
    };

    const handleExportPDF = async () => {
        setExporting('pdf');
        try {
            const name = data.personal.full_name?.replace(/\s+/g, '_') || 'resume';
            await exportToPDF('resume-preview-container', `${name}_Resume.pdf`);
        } catch (e) { console.error('PDF export error:', e); }
        setExporting(null);
    };

    const handleExportDOCX = async () => {
        setExporting('docx');
        try {
            const name = data.personal.full_name?.replace(/\s+/g, '_') || 'resume';
            await exportToDOCX(data, `${name}_Resume.docx`);
        } catch (e) { console.error('DOCX export error:', e); }
        setExporting(null);
    };

    const handleDownloadJSON = () => {
        const output = {
            meta: { generated_at: new Date().toISOString(), target_role: data.target_role, template: selectedId, ats_score: data.ats?.score },
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

    return (
        <SectionCard icon={Palette} title="Visual Resume Studio" subtitle={`${TEMPLATE_CATALOG.length} templates • Live editor • AI optimizer • Export`}>
            <div className="space-y-6">

                {/* ── TEMPLATE MARKETPLACE ── */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">
                            Template Library <span className="text-[10px] font-bold text-[#5c52d2] ml-1.5 px-2 py-0.5 bg-purple-50 rounded-full">{TEMPLATE_CATALOG.length} templates</span>
                        </h3>
                        <div className="flex items-center gap-2">
                            {/* Search */}
                            <div className="relative">
                                <Search className="w-3 h-3 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-300" />
                                <input
                                    type="text"
                                    placeholder="Search templates..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-7 pr-3 py-1.5 text-[10px] border border-gray-200 rounded-xl w-44 focus:outline-none focus:ring-2 focus:ring-purple-200 focus:border-[#5c52d2] bg-white"
                                />
                            </div>
                            {/* Colors */}
                            <div className="flex items-center gap-0.5">
                                {THEME_COLORS.map(theme => (
                                    <button
                                        key={theme.id}
                                        onClick={() => setCustomColor(customColor === theme.color ? null : theme.color)}
                                        className={`w-5 h-5 rounded-md transition-all flex items-center justify-center ${customColor === theme.color ? 'ring-2 ring-offset-1 ring-gray-300 scale-110' : 'opacity-50 hover:opacity-100 hover:scale-105'}`}
                                        style={{ backgroundColor: theme.color }}
                                        title={theme.label}
                                    >
                                        {customColor === theme.color && <CheckCircle2 className="w-2.5 h-2.5 text-white" />}
                                    </button>
                                ))}
                                {customColor && (
                                    <button onClick={() => setCustomColor(null)} className="text-[9px] text-gray-400 hover:text-gray-600 ml-1 underline">Reset</button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Category groups */}
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                        {TEMPLATE_CATEGORIES.map(cat => {
                            const templates = filteredCatalog.filter(t => t.category === cat);
                            if (templates.length === 0) return null;
                            const isExpanded = expandedCats.has(cat);
                            return (
                                <div key={cat}>
                                    <button
                                        onClick={() => toggleCategory(cat)}
                                        className="w-full flex items-center justify-between py-1.5 px-2 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                                            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                            {cat}
                                            <span className="text-[9px] font-normal text-gray-300">({templates.length})</span>
                                        </span>
                                    </button>
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-1.5 p-1">
                                                    {templates.map(tmpl => {
                                                        const isSelected = selectedId === tmpl.template_id;
                                                        const displayColor = customColor || tmpl.default_color;
                                                        return (
                                                            <motion.button
                                                                key={tmpl.template_id}
                                                                whileHover={{ scale: 1.05 }}
                                                                whileTap={{ scale: 0.95 }}
                                                                onClick={() => { setSelectedId(tmpl.template_id); setOptimized(false); }}
                                                                className={`relative p-1.5 rounded-xl border-2 text-left transition-all ${isSelected
                                                                    ? 'border-[#5c52d2] bg-purple-50/50 shadow-md'
                                                                    : 'border-gray-100 hover:border-gray-200 bg-white'
                                                                    }`}
                                                                title={`${tmpl.name} — ATS: ${tmpl.ats_priority} — ${tmpl.recommended_for_roles.join(', ')}`}
                                                            >
                                                                {isSelected && (
                                                                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#5c52d2] rounded-full flex items-center justify-center shadow z-10">
                                                                        <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                                                                    </div>
                                                                )}
                                                                <div className="w-full h-10 rounded-lg border border-gray-100 overflow-hidden bg-white mb-1">
                                                                    <MiniThumb base={tmpl.base} color={displayColor} />
                                                                </div>
                                                                <p className="text-[8px] font-bold text-gray-700 truncate leading-tight">{tmpl.name}</p>
                                                                <span className={`text-[7px] font-bold px-1 py-px rounded ${tmpl.ats_priority === 'high' ? 'bg-emerald-50 text-emerald-500' :
                                                                    tmpl.ats_priority === 'medium' ? 'bg-amber-50 text-amber-500' :
                                                                        'bg-gray-50 text-gray-400'
                                                                    }`}>{tmpl.ats_priority}</span>
                                                            </motion.button>
                                                        );
                                                    })}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            );
                        })}
                    </div>

                    {/* Selected template info */}
                    <div className="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-xl text-[10px] text-gray-400 font-medium flex-wrap">
                        <span><span className="font-bold text-gray-600">Selected:</span> {selected.name}</span>
                        <span><span className="font-bold text-gray-600">Layout:</span> {selected.layout_type}</span>
                        <span><span className="font-bold text-gray-600">ATS:</span> {selected.ats_priority}</span>
                        <span><span className="font-bold text-gray-600">For:</span> {selected.recommended_for_roles.slice(0, 3).join(', ')}</span>
                    </div>
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

                {/* ── LIVE PREVIEW HEADER ── */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#5c52d2]" />
                        <h3 className="text-xs font-black uppercase tracking-widest text-gray-400">Live Preview & Editor</h3>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] text-gray-400 font-bold">Zoom:</span>
                            <input type="range" min="0.3" max="1" step="0.05" value={previewScale} onChange={e => setPreviewScale(parseFloat(e.target.value))} className="w-20 h-1 accent-[#5c52d2]" />
                            <span className="text-[10px] font-bold text-gray-500 w-8">{Math.round(previewScale * 100)}%</span>
                        </div>
                    </div>
                </div>

                {/* ── LIVE PREVIEW AREA ── */}
                <div className={`bg-gray-100 rounded-2xl p-4 overflow-auto border border-gray-200 shadow-inner transition-all duration-300 ${showPanel ? 'max-h-[750px]' : 'max-h-[700px]'}`}>
                    <div
                        className="mx-auto shadow-2xl border border-gray-200 rounded-lg overflow-hidden"
                        style={{ width: `${794 * previewScale}px`, transformOrigin: 'top center' }}
                    >
                        <div
                            id="resume-preview-container"
                            ref={previewRef}
                            style={{ width: '794px', transform: `scale(${previewScale})`, transformOrigin: 'top left' }}
                        >
                            <RenderTemplate base={selected.base} data={data} color={accentColor} />
                        </div>
                    </div>
                </div>

                {/* ── EXPORT ACTIONS ── */}
                <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleExportPDF} disabled={!!exporting}
                        className="px-8 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-red-200 hover:shadow-xl transition-all disabled:opacity-60 flex items-center gap-2.5">
                        {exporting === 'pdf' ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating PDF...</> : <><FileText className="w-4 h-4" /> Download PDF</>}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleExportDOCX} disabled={!!exporting}
                        className="px-8 py-3.5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-blue-200 hover:shadow-xl transition-all disabled:opacity-60 flex items-center gap-2.5">
                        {exporting === 'docx' ? <><Loader2 className="w-4 h-4 animate-spin" /> Generating DOCX...</> : <><FileType2 className="w-4 h-4" /> Download DOCX</>}
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDownloadJSON}
                        className="px-8 py-3.5 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-lg hover:bg-gray-800 transition-all flex items-center gap-2.5">
                        <Download className="w-4 h-4" /> Download JSON
                    </motion.button>
                </div>

                <p className="text-center text-[10px] text-gray-300 font-bold uppercase tracking-widest">
                    JSON data is your single source of truth • Templates are visual presentation only
                </p>
            </div>

            {/* ═══════════════════════════════════════════════════ */}
            {/* FLOATING DRAGGABLE SIDE PANEL                       */}
            {/* ═══════════════════════════════════════════════════ */}
            <AnimatePresence>
                {showPanel ? (
                    <motion.div
                        key="editor-panel"
                        drag
                        dragMomentum={false}
                        dragElastic={0}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                        className="fixed z-50"
                        style={{
                            right: '16px',
                            top: 'calc(50% - 260px)',
                            width: '340px',
                            height: '520px',
                        }}
                    >
                        <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden"
                            style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(92,82,210,0.12)' }}
                        >
                            {/* Drag Handle + Header */}
                            <div
                                className="flex items-center justify-between px-3 py-2 bg-gradient-to-r from-[#5c52d2] to-[#7c3aed] rounded-t-2xl shrink-0 cursor-grab active:cursor-grabbing select-none"
                            >
                                <div className="flex items-center gap-2">
                                    <GripVertical className="w-3.5 h-3.5 text-white/60" />
                                    <span className="text-white text-xs font-black">✏️ Resume Editor</span>
                                    <span className="text-[9px] text-white/50 font-medium">drag to move</span>
                                </div>
                                <button
                                    onClick={() => setShowPanel(false)}
                                    className="w-6 h-6 flex items-center justify-center rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                                    title="Minimize Editor"
                                >
                                    <PanelRightClose className="w-3.5 h-3.5" />
                                </button>
                            </div>
                            {/* Panel Body */}
                            <div className="flex-1 overflow-hidden">
                                <SidePanelEditor
                                    data={data}
                                    onChange={onChange}
                                    selectedTemplate={selected.base}
                                />
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    /* Minimized tab — small button on right side */
                    <motion.button
                        key="editor-tab"
                        initial={{ x: 60, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 60, opacity: 0 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        onClick={() => setShowPanel(true)}
                        className="fixed z-50 right-0 bg-gradient-to-r from-[#5c52d2] to-[#7c3aed] text-white rounded-l-2xl shadow-xl hover:shadow-2xl transition-shadow flex items-center gap-2 px-4 py-3"
                        style={{ top: '50%', transform: 'translateY(-50%)' }}
                        title="Open Resume Editor"
                    >
                        <PanelRightOpen className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-wider">Editor</span>
                    </motion.button>
                )}
            </AnimatePresence>
        </SectionCard>
    );
}
