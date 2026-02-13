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
