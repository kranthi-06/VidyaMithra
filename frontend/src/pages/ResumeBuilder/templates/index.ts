export { ModernTemplate } from './ModernTemplate';
export { ClassicTemplate } from './ClassicTemplate';
export { CreativeTemplate } from './CreativeTemplate';
export { DeveloperTemplate } from './DeveloperTemplate';

export type TemplateId = 'modern' | 'classic' | 'creative' | 'developer';

export interface TemplateConfig {
    id: TemplateId;
    name: string;
    description: string;
    badge: string;
    previewBg: string;
}

export const TEMPLATES: TemplateConfig[] = [
    {
        id: 'modern',
        name: 'Modern Professional',
        description: 'Clean, modern design with subtle colors and excellent readability',
        badge: 'Most Popular',
        previewBg: 'bg-white',
    },
    {
        id: 'classic',
        name: 'Classic Traditional',
        description: 'Traditional format preferred by conservative industries',
        badge: 'ATS Optimized',
        previewBg: 'bg-white',
    },
    {
        id: 'creative',
        name: 'Creative Designer',
        description: 'Eye-catching design for creative professionals',
        badge: 'Stand Out',
        previewBg: 'bg-white',
    },
    {
        id: 'developer',
        name: 'Code / Developer',
        description: 'Terminal-inspired layout for tech roles',
        badge: 'Tech Focus',
        previewBg: 'bg-[#0d1117]',
    },
];

export const THEME_COLORS: { id: string; label: string; color: string }[] = [
    { id: 'purple', label: 'Purple', color: '#5c52d2' },
    { id: 'blue', label: 'Blue', color: '#3b82f6' },
    { id: 'rose', label: 'Rose', color: '#e11d48' },
    { id: 'emerald', label: 'Emerald', color: '#10b981' },
    { id: 'slate', label: 'Slate', color: '#334155' },
    { id: 'amber', label: 'Amber', color: '#d97706' },
];
