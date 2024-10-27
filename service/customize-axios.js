import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://192.168.2.12:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
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
