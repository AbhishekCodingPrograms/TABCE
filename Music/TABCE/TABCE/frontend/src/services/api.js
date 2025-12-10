import axios from 'axios';

const API_URL = 'http://localhost:8000';

export const api = {
    uploadPackshot: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post(`${API_URL}/upload/packshot`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    generate: async (config) => {
        // Config: { product_id, theme, segments... }
        const response = await axios.post(`${API_URL}/generate`, config);
        return response.data;
    },

    getStatus: async (jobId) => {
        const response = await axios.get(`${API_URL}/status/${jobId}`);
        return response.data;
    },

    getDownloadUrl: (jobId, filename) => {
        return `${API_URL}/download/${jobId}/${filename}`;
    }
};
