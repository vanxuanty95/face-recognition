import axiosInstance from '../utils/axiosInstance';
import API_URLS from '../constants/apiUrls';

// Fetch classes for a specific date
export const fetchClasses = async (date: string, studentId: string, token: string): Promise<any[]> => {
    try {
        const bodyData = { date, studentId: studentId }; // Add body data
        const response = await axiosInstance.post(`${API_URLS.API_STUDENTS}/classes`, bodyData, {headers: {
            Authorization: `Bearer ${token}`,
          },}); // Pass body data as the second argument
        console.log('Fetched classes:', response.data);
        return response.data as any[]; // Explicitly cast the response data to any[]
    } catch (error:any) {
        console.error('Error fetching classes:', error.message); // Log error message
        if (error.response) {
            console.error('Error response data:', error.response.data); // Log server response data
            console.error('Error response status:', error.response.status); // Log HTTP status code
        } else if (error.request) {
            console.error('No response received:', error.request); // Log request details if no response
        } else {
            console.error('Request setup error:', error.config); // Log request configuration
        }
        return []; // Return an empty array on error
    }
};

export const storeFaceImage = async (base64Image: string, token: string): Promise<any> => {
    try {
        const response = await axiosInstance.post(
            '/api/attendances/store-face-image',
            { image: base64Image },
            {
                headers: {
                    Authorization: `Bearer ${token}`, // Include the token in the Authorization header
                },
            }
        );
        return response.data;
    } catch (error: any) {
        console.error('Failed to upload face image:', error.message);
        if (error.response) {
            console.error('Error status:', error.response.status);
            console.error('Error data:', error.response.data);
        }
        throw error; // Re-throw the error for the caller to handle
    }
};


// Check in to a class
// export const checkInClass = async (classId: string) => {
//     try {
//         const response = await axiosInstance.post(API_URLS.CHECK_IN_CLASS(classId));
//         return response.data;
//     } catch (error) {
//         console.error('Error checking in to class:', error);
//         throw error;
//     }
// };
