import * as pdfjsLib from 'pdfjs-dist';
import Tesseract from 'tesseract.js';

// Setup worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

export const extractTextFromFile = async (file: File, onProgress?: (msg: string) => void): Promise<string> => {
    const fileType = file.type;

    if (fileType === 'application/pdf') {
        onProgress?.('Reading PDF content...');
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';
        let hasSelectableText = false;

        for (let i = 1; i <= pdf.numPages; i++) {
            onProgress?.(`Checking page ${i} of ${pdf.numPages}...`);
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            if (pageText.trim().length > 10) {
                hasSelectableText = true;
            }
            fullText += pageText + '\n';
        }

        // If very little text was found, it's likely a scan. Use OCR.
        if (!hasSelectableText || fullText.trim().length < 100) {
            onProgress?.('Scanned PDF detected. Starting OCR (this may take a moment)...');
            fullText = '';
            for (let i = 1; i <= pdf.numPages; i++) {
                onProgress?.(`Performing OCR on page ${i} of ${pdf.numPages}...`);
                const page = await pdf.getPage(i);
                const viewport = page.getViewport({ scale: 2 });
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d')!;
                canvas.height = viewport.height;
                canvas.width = viewport.width;
                await page.render({ canvasContext: context, viewport, canvas }).promise;
                const imageData = canvas.toDataURL('image/png');
                const { data: { text } } = await Tesseract.recognize(imageData, 'eng');
                fullText += text + '\n';
            }
        }
        return fullText;
    } else if (fileType.startsWith('image/')) {
        onProgress?.('Extracting text from image...');
        const { data: { text } } = await Tesseract.recognize(file, 'eng');
        return text;
    } else {
        throw new Error('Unsupported file type. Please upload a PDF or an Image.');
    }
};
