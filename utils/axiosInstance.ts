import axios from 'axios';
import { Platform } from 'react-native';

const axiosInstance = axios.create({
    baseURL: Platform.OS === 'ios' ? 'http://192.168.1.10:8080' : 'http://10.0.2.2:8080', // Use 10.0.2.2 for Android emulator
    timeout: parseInt(process.env.API_TIMEOUT || '30000', 10),
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
axiosInstance.interceptors.request.use(
    (config) => {
        // console.log('Request:', config); // Log request details
        return config;
    },
    (error) => {
        console.error('Request error:', error); // Log request error
        return Promise.reject(error);
    }
);

// Response interceptor
axiosInstance.interceptors.response.use(
    (response) => {
        // console.log('Response:', response); // Log response details
        return response;
    },
    (error) => {
        console.error('Response error:', error); // Log response error
        if (error.response) {
            console.error('Error status:', error.response.status); // Log HTTP status code
            console.error('Error data:', error.response.data); // Log error response data
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
