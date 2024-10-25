import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080/api', // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json', // Adjust headers as needed
  }
});

// Add a response interceptor to return response.data
axiosInstance.interceptors.response.use(
  response => response.data, // Intercept and return only the data part of the response
  error => {
    // Optional: You can log the error here for additional debugging
    console.error('Axios error:', error.response || error.message);
    return Promise.reject(error); // Forward any errors
  }
);

export { axiosInstance };
