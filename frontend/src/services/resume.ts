import api from './api';

export const analyzeResume = async (file: File, jobDescription: string = '') => {
    const formData = new FormData();
    formData.append('file', file);
    if (jobDescription) {
        formData.append('job_description', jobDescription);
    }

    const response = await api.post('/resume/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const analyzeResumeText = async (text: string, filename: string = 'resume.txt', jobDescription: string = '') => {
    const formData = new FormData();
    formData.append('text', text);
    formData.append('filename', filename);
    if (jobDescription) {
        formData.append('job_description', jobDescription);
    }

    const response = await api.post('/resume/analyze-text', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
