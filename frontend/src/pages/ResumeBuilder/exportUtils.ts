import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopPosition, TabStopType } from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData } from './types';

/**
 * Export resume as a print-ready PDF.
 *
 * Strategy: clone the rendered template into a hidden iframe that has
 * proper A4 print-CSS, then trigger window.print() inside that iframe.
 * This gives us:
 *   • Full-page, A4-sized output
 *   • Real text (not a screenshot) → ATS-safe, selectable, searchable
 *   • Correct colors and layouts
 *   • No dependency on html2canvas (which can't handle all CSS)
 */
export async function exportToPDF(elementId: string, _filename: string = 'resume.pdf'): Promise<void> {
    const source = document.getElementById(elementId);
    if (!source) throw new Error('Resume preview element not found');

    // ── 1. Collect all stylesheets from the current page ────────────
    const styleSheets: string[] = [];

    // Grab all <link rel="stylesheet"> and inline <style> tags
    document.querySelectorAll('link[rel="stylesheet"], style').forEach(node => {
        if (node instanceof HTMLLinkElement) {
            styleSheets.push(`<link rel="stylesheet" href="${node.href}" />`);
        } else if (node instanceof HTMLStyleElement) {
            styleSheets.push(`<style>${node.innerHTML}</style>`);
        }
    });

    // ── 2. Build print-specific CSS ────────────────────────────────
    const printCSS = `
        <style>
            /* Reset everything for print */
            @page {
                size: A4;
                margin: 0;
            }

            *, *::before, *::after {
                box-sizing: border-box;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
                color-adjust: exact !important;
            }

            html, body {
                width: 210mm;
                min-height: 297mm;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            body {
                display: block !important;
            }

            /* The print container that holds the resume */
            .resume-print-root {
                width: 210mm;
                min-height: 297mm;
                margin: 0;
                padding: 0;
                background: white !important;
                overflow: visible;
            }

            /* Reset the resume content to fill the page */
            .resume-print-root > * {
                width: 100% !important;
                max-width: 100% !important;
                min-height: 297mm;
                margin: 0 !important;
                transform: none !important;
            }

            /* Hide scrollbars, borders, shadows in print */
            ::-webkit-scrollbar { display: none; }

            @media print {
                html, body {
                    width: 210mm;
                    height: auto;
                    margin: 0 !important;
                    padding: 0 !important;
                    overflow: visible !important;
                }

                .resume-print-root {
                    width: 210mm;
                    min-height: 297mm;
                    padding: 0;
                    margin: 0;
                    background: white !important;
                    page-break-inside: auto;
                }

                .resume-print-root > * {
                    width: 100% !important;
                    max-width: 100% !important;
                    margin: 0 !important;
                    padding-left: 0 !important;
                    padding-right: 0 !important;
                    transform: none !important;
                    box-shadow: none !important;
                }
            }
        </style>
    `;

    // ── 3. Clone the resume element ────────────────────────────────
    const clone = source.cloneNode(true) as HTMLElement;

    // Strip off any inline transforms the preview applied (scaling, etc.)
    clone.style.transform = 'none';
    clone.style.width = '100%';
    clone.style.position = 'static';
    clone.removeAttribute('id');

    // ── 4. Build the iframe document ───────────────────────────────
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=210mm" />
            <title>Resume</title>
            ${styleSheets.join('\n')}
            ${printCSS}
        </head>
        <body>
            <div class="resume-print-root">
                ${clone.outerHTML}
            </div>
        </body>
        </html>
    `;

    // ── 5. Create hidden iframe and inject content ─────────────────
    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.left = '-10000px';
    iframe.style.top = '0';
    iframe.style.width = '210mm';
    iframe.style.height = '297mm';
    iframe.style.border = 'none';
    iframe.style.opacity = '0';
    iframe.style.pointerEvents = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
        document.body.removeChild(iframe);
        throw new Error('Could not access iframe document');
    }

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // ── 6. Wait for stylesheets to load, then print ────────────────
    await new Promise<void>((resolve) => {
        const onReady = () => {
            setTimeout(() => {
                try {
                    iframe.contentWindow?.print();
                } catch (e) {
                    console.error('Print failed:', e);
                    // Fallback: trigger print on main window
                    window.print();
                }
                // Cleanup after a delay to let print dialog finish
                setTimeout(() => {
                    document.body.removeChild(iframe);
                    resolve();
                }, 1000);
            }, 500); // Let CSS settle
        };

        // Wait for iframe to finish loading
        iframe.onload = onReady;

        // Fallback if onload doesn't fire
        setTimeout(onReady, 2000);
    });
}

/**
 * Export resume data as DOCX from JSON data directly
 */
export async function exportToDOCX(data: ResumeData, filename: string = 'resume.docx'): Promise<void> {
    const p = data.personal;
    const sections: Paragraph[] = [];

    // Title - Name
    sections.push(
        new Paragraph({
            children: [new TextRun({ text: p.full_name || 'Your Name', bold: true, size: 36, font: 'Calibri' })],
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
        })
    );

    // Subtitle - Role
    if (data.target_role) {
        sections.push(
            new Paragraph({
                children: [new TextRun({ text: data.target_role, size: 22, color: '555555', font: 'Calibri' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 100 },
            })
        );
    }

    // Contact Info
    const contactParts: string[] = [];
    if (p.email) contactParts.push(p.email);
    if (p.phone) contactParts.push(p.phone);
    if (p.location) contactParts.push(p.location);
    if (contactParts.length > 0) {
        sections.push(
            new Paragraph({
                children: [new TextRun({ text: contactParts.join('  |  '), size: 18, color: '777777', font: 'Calibri' })],
                alignment: AlignmentType.CENTER,
                spacing: { after: 200 },
                border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' } },
            })
        );
    }

    // Professional Summary
    if (p.professional_summary) {
        sections.push(createSectionHeading('PROFESSIONAL SUMMARY'));
        sections.push(
            new Paragraph({
                children: [new TextRun({ text: p.professional_summary, size: 20, font: 'Calibri' })],
                spacing: { after: 200 },
            })
        );
    }

    // Experience
    const validExperience = data.experience.filter(e => e.title);
    if (validExperience.length > 0) {
        sections.push(createSectionHeading('PROFESSIONAL EXPERIENCE'));
        for (const exp of validExperience) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: exp.title, bold: true, size: 22, font: 'Calibri' }),
                        new TextRun({ text: `  —  ${exp.organization}`, size: 20, color: '555555', font: 'Calibri' }),
                    ],
                    spacing: { before: 150 },
                    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
                })
            );
            sections.push(
                new Paragraph({
                    children: [new TextRun({ text: exp.duration, italics: true, size: 18, color: '888888', font: 'Calibri' })],
                    spacing: { after: 80 },
                })
            );
            if (exp.bullets && exp.bullets.length > 0) {
                for (const bullet of exp.bullets) {
                    sections.push(
                        new Paragraph({
                            children: [new TextRun({ text: bullet, size: 20, font: 'Calibri' })],
                            bullet: { level: 0 },
                            spacing: { after: 40 },
                        })
                    );
                }
            } else if (exp.description) {
                sections.push(
                    new Paragraph({
                        children: [new TextRun({ text: exp.description, size: 20, font: 'Calibri' })],
                        spacing: { after: 80 },
                    })
                );
            }
        }
    }

    // Education
    const validEducation = data.education.filter(e => e.degree);
    if (validEducation.length > 0) {
        sections.push(createSectionHeading('EDUCATION'));
        for (const ed of validEducation) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: ed.degree, bold: true, size: 22, font: 'Calibri' }),
                        new TextRun({ text: `  —  ${ed.institution}`, size: 20, color: '555555', font: 'Calibri' }),
                    ],
                    spacing: { before: 100 },
                })
            );
            sections.push(
                new Paragraph({
                    children: [new TextRun({ text: ed.duration, italics: true, size: 18, color: '888888', font: 'Calibri' })],
                    spacing: { after: 80 },
                })
            );
            if (ed.description) {
                sections.push(
                    new Paragraph({
                        children: [new TextRun({ text: ed.description, size: 20, font: 'Calibri' })],
                        spacing: { after: 80 },
                    })
                );
            }
        }
    }

    // Projects
    const validProjects = data.projects.filter(p => p.name);
    if (validProjects.length > 0) {
        sections.push(createSectionHeading('PROJECTS'));
        for (const proj of validProjects) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: proj.name, bold: true, size: 22, font: 'Calibri' }),
                    ],
                    spacing: { before: 100 },
                })
            );
            if (proj.technologies) {
                sections.push(
                    new Paragraph({
                        children: [new TextRun({ text: `Technologies: ${proj.technologies}`, italics: true, size: 18, color: '555555', font: 'Calibri' })],
                    })
                );
            }
            if (proj.description) {
                sections.push(
                    new Paragraph({
                        children: [new TextRun({ text: proj.description, size: 20, font: 'Calibri' })],
                        spacing: { after: 80 },
                    })
                );
            }
        }
    }

    // Skills
    const allSkills = [...data.skills.technical_skills, ...data.skills.tools, ...data.skills.soft_skills];
    if (allSkills.length > 0) {
        sections.push(createSectionHeading('SKILLS'));
        if (data.skills.technical_skills.length > 0) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Technical Skills: ', bold: true, size: 20, font: 'Calibri' }),
                        new TextRun({ text: data.skills.technical_skills.join(', '), size: 20, font: 'Calibri' }),
                    ],
                    spacing: { after: 60 },
                })
            );
        }
        if (data.skills.tools.length > 0) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Tools & Frameworks: ', bold: true, size: 20, font: 'Calibri' }),
                        new TextRun({ text: data.skills.tools.join(', '), size: 20, font: 'Calibri' }),
                    ],
                    spacing: { after: 60 },
                })
            );
        }
        if (data.skills.soft_skills.length > 0) {
            sections.push(
                new Paragraph({
                    children: [
                        new TextRun({ text: 'Soft Skills: ', bold: true, size: 20, font: 'Calibri' }),
                        new TextRun({ text: data.skills.soft_skills.join(', '), size: 20, font: 'Calibri' }),
                    ],
                    spacing: { after: 60 },
                })
            );
        }
    }

    const doc = new Document({
        sections: [
            {
                properties: {
                    page: {
                        margin: { top: 720, right: 720, bottom: 720, left: 720 },
                    },
                },
                children: sections,
            },
        ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, filename);
}

function createSectionHeading(text: string): Paragraph {
    return new Paragraph({
        children: [
            new TextRun({ text, bold: true, size: 22, font: 'Calibri', allCaps: true }),
        ],
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: '333333' } },
    });
}
