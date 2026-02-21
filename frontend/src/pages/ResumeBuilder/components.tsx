import { motion } from 'framer-motion';
import { CheckCircle2, Target, User, GraduationCap, Briefcase, Laptop, Wrench, ShieldCheck, Palette } from 'lucide-react';
import type { BuilderStep } from './types';
import { STEP_CONFIG } from './types';

const ICONS: Record<string, any> = { Target, User, GraduationCap, Briefcase, Laptop, Wrench, ShieldCheck, Palette };

export function Stepper({ current }: { current: BuilderStep }) {
    return (
        <div className="flex items-center justify-between mb-12 max-w-5xl mx-auto overflow-x-auto pb-4 px-2">
            {STEP_CONFIG.map((s, i) => {
                const Icon = ICONS[s.icon];
                const done = current > s.id;
                const active = current === s.id;
                return (
                    <div key={s.id} className="flex items-center">
                        <div className="flex flex-col items-center gap-1.5">
                            <motion.div
                                initial={false}
                                animate={{ scale: active ? 1.15 : 1 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm transition-all shadow-sm ${active ? 'bg-[#5c52d2] text-white ring-4 ring-purple-100' : done ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-400'}`}
                            >
                                {done ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-4 h-4" />}
                            </motion.div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest whitespace-nowrap ${active ? 'text-[#5c52d2]' : done ? 'text-emerald-600' : 'text-gray-400'}`}>{s.label}</span>
                        </div>
                        {i < STEP_CONFIG.length - 1 && (
                            <div className={`w-8 sm:w-14 h-0.5 mx-2 mt-[-14px] transition-colors ${done ? 'bg-green-400' : 'bg-gray-100'}`} />
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export function AIButton({ onClick, loading, label }: { onClick: () => void; loading: boolean; label?: string }) {
    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-[#5c52d2] to-[#7c3aed] text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-200 hover:shadow-xl transition-all disabled:opacity-60 flex items-center gap-2"
        >
            {loading ? (
                <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> AI Processing...</>
            ) : (
                <><span className="text-lg">✨</span> {label || 'Enhance with AI'}</>
            )}
        </motion.button>
    );
}

export function RegenerateBar({ onRegenerate, loading }: { onRegenerate: (mode: string) => void; loading: boolean }) {
    const modes = [
        { id: 'shorter', label: '📝 Shorter' },
        { id: 'stronger', label: '💪 Stronger' },
        { id: 'technical', label: '⚙️ Technical' },
        { id: 'simpler', label: '🎯 Simpler' },
    ];
    return (
        <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-100 mt-4">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest self-center mr-2">Restyle:</span>
            {modes.map(m => (
                <button key={m.id} onClick={() => onRegenerate(m.id)} disabled={loading}
                    className="px-3 py-1.5 text-xs font-bold rounded-xl border border-gray-200 text-gray-600 hover:bg-purple-50 hover:border-purple-200 hover:text-[#5c52d2] disabled:opacity-40 transition-all">
                    {m.label}
                </button>
            ))}
        </div>
    );
}

export function SectionCard({ children, icon: Icon, title, subtitle }: { children: React.ReactNode; icon: any; title: string; subtitle?: string }) {
    return (
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
            <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-[#5c52d2]">
                    <Icon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">{title}</h2>
                    {subtitle && <p className="text-sm text-gray-400 font-medium">{subtitle}</p>}
                </div>
            </div>
            {children}
        </motion.div>
    );
}

export function FieldInput({ label, value, onChange, placeholder, type = 'text' }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">{label}</label>
            <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
                className="w-full h-14 rounded-2xl border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all font-bold px-6 text-sm outline-none" />
        </div>
    );
}

export function FieldTextarea({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
    return (
        <div className="space-y-1.5">
            <label className="text-xs font-black uppercase text-gray-400 ml-1">{label}</label>
            <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
                className="w-full rounded-[2rem] border border-gray-100 bg-gray-50/50 focus:bg-white focus:ring-2 focus:ring-purple-200 focus:border-purple-400 transition-all font-bold p-6 text-sm outline-none resize-none" />
        </div>
    );
}
