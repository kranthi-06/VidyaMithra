import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, BorderStyle, TabStopPosition, TabStopType } from 'docx';
import { saveAs } from 'file-saver';
import type { ResumeData } from './types';

/**
 * Export resume preview as PDF by capturing the rendered HTML template
 */
export async function exportToPDF(elementId: string, filename: string = 'resume.pdf'): Promise<void> {
    const element = document.getElementById(elementId);
    if (!element) throw new Error('Resume preview element not found');

    // Clone and prepare for capture
    const clone = element.cloneNode(true) as HTMLElement;
    clone.style.width = '794px'; // A4 width at 96 DPI
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    document.body.appendChild(clone);

    try {
        const canvas = await html2canvas(clone, {
            scale: 2,
            useCORS: true,
            logging: false,
            backgroundColor: '#ffffff',
            width: 794,
            windowWidth: 794,
        });

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * pdfWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // First page
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Additional pages if needed
        while (heightLeft > 0) {
            position -= pdfHeight;
            pdf.addPage();
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(filename);
    } finally {
        document.body.removeChild(clone);
    }
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
