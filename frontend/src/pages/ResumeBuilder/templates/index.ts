export { ModernTemplate } from './ModernTemplate';
export { ClassicTemplate } from './ClassicTemplate';
export { CreativeTemplate } from './CreativeTemplate';
export { DeveloperTemplate } from './DeveloperTemplate';
export { MinimalATSTemplate } from './MinimalATSTemplate';
export { AcademicTemplate } from './AcademicTemplate';
export { ExecutiveTemplate } from './ExecutiveTemplate';
export { TwoColumnTemplate } from './TwoColumnTemplate';
export { PortfolioTemplate } from './PortfolioTemplate';

export type TemplateId = 'modern' | 'classic' | 'creative' | 'developer' | 'minimal-ats' | 'academic' | 'executive' | 'two-column' | 'portfolio';

export type LayoutType = 'single-column' | 'two-column' | 'sidebar' | 'code-block' | 'card-grid';
export type EmphasisType = 'experience' | 'skills' | 'projects' | 'education' | 'balanced';
export type ATSPriority = 'high' | 'medium' | 'low';

export interface TemplateConfig {
    id: TemplateId;
    name: string;
    description: string;
    badge: string;
    previewBg: string;
    layout_type: LayoutType;
    emphasis: EmphasisType;
    ats_priority: ATSPriority;
}

export const TEMPLATES: TemplateConfig[] = [
    {
        id: 'modern',
        name: 'Modern Professional',
        description: 'Clean, modern design with subtle colors and excellent readability',
        badge: 'Most Popular',
        previewBg: 'bg-white',
        layout_type: 'sidebar',
        emphasis: 'balanced',
        ats_priority: 'high',
    },
    {
        id: 'classic',
        name: 'Classic Traditional',
        description: 'Traditional format preferred by conservative industries',
        badge: 'ATS Optimized',
        previewBg: 'bg-white',
        layout_type: 'single-column',
        emphasis: 'experience',
        ats_priority: 'high',
    },
    {
        id: 'creative',
        name: 'Creative Designer',
        description: 'Eye-catching design for creative professionals',
        badge: 'Stand Out',
        previewBg: 'bg-white',
        layout_type: 'two-column',
        emphasis: 'projects',
        ats_priority: 'medium',
    },
    {
        id: 'developer',
        name: 'Code / Developer',
        description: 'Terminal-inspired layout for tech roles',
        badge: 'Tech Focus',
        previewBg: 'bg-[#0d1117]',
        layout_type: 'code-block',
        emphasis: 'skills',
        ats_priority: 'low',
    },
    {
        id: 'minimal-ats',
        name: 'Minimal ATS',
        description: 'Ultra-clean format optimized for ATS scanners',
        badge: 'Max ATS Score',
        previewBg: 'bg-white',
        layout_type: 'single-column',
        emphasis: 'experience',
        ats_priority: 'high',
    },
    {
        id: 'academic',
        name: 'Academic / Student',
        description: 'Education-first layout for students and academics',
        badge: 'Student',
        previewBg: 'bg-white',
        layout_type: 'single-column',
        emphasis: 'education',
        ats_priority: 'high',
    },
    {
        id: 'executive',
        name: 'Executive',
        description: 'Bold, authoritative design for senior professionals',
        badge: 'Leadership',
        previewBg: 'bg-white',
        layout_type: 'single-column',
        emphasis: 'experience',
        ats_priority: 'medium',
    },
    {
        id: 'two-column',
        name: 'Two-Column Pro',
        description: 'Balanced two-column layout with skill bars',
        badge: 'Professional',
        previewBg: 'bg-white',
        layout_type: 'two-column',
        emphasis: 'balanced',
        ats_priority: 'medium',
    },
    {
        id: 'portfolio',
        name: 'Portfolio Visual',
        description: 'Visual-heavy with project cards and hero banner',
        badge: 'Creative',
        previewBg: 'bg-white',
        layout_type: 'card-grid',
        emphasis: 'projects',
        ats_priority: 'low',
    },
];

export const THEME_COLORS: { id: string; label: string; color: string }[] = [
    { id: 'purple', label: 'Purple', color: '#5c52d2' },
    { id: 'blue', label: 'Blue', color: '#3b82f6' },
    { id: 'rose', label: 'Rose', color: '#e11d48' },
    { id: 'emerald', label: 'Emerald', color: '#10b981' },
    { id: 'slate', label: 'Slate', color: '#334155' },
    { id: 'amber', label: 'Amber', color: '#d97706' },
    { id: 'sky', label: 'Sky', color: '#0ea5e9' },
    { id: 'violet', label: 'Violet', color: '#8b5cf6' },
];
