import { axiosInstance } from './customize-axios';

export const getWatchAndSearchByAdmin = async (keyword) => {
    try {
        const response = await axiosInstance.post('http://localhost:1811/api/watches/client/get-all', {
            keyword
        });

        // Assuming your backend response has the structure you've provided
        return {
            isSuccess: true,
            message: response.data.message, // Assuming the message is always present on successful login
            data: response.data, // Return the entire data
        };

    } catch (error) {
        console.error('getWatchAndSearchByAdmin error:', error);
        return {
            isSuccess: false,
            error: {
                message: error.response?.data?.error || "An unexpected error occurred",
            },
        };
    }
};


export const editWatchByAdmin = async (id, values) => {
    try {
        const response = await axiosInstance.put(`http://localhost:1811/api/watches/${id}`, values);

        return {
            isSuccess: true,
            message: response.data.message || 'Operation successful',
            data: response.data,
        };
    } catch (error) {
        console.error('Edit watch error:', error);
        return {
            isSuccess: false,
            error: {
                message: error.response?.data?.error || 'An unexpected error occurred',
                status: error.response?.status || 500, // Optional: Get status code for more info
            },
        };
    }
};


export const addWatchByAdmin = async (watchName, image, price, Automatic, watchDescription, brand) => {
    try {
        const response = await axiosInstance.post('http://localhost:1811/api/watches', {
            watchName,
            image,
            price,
            Automatic,
            watchDescription,
            brand
        });

        // Assuming your backend response has the structure you've provided
        return {
            isSuccess: true,
            message: response.data.message, // Assuming the message is always present on successful login
            data: response.data, // Return the entire data
        };

    } catch (error) {
        console.error('getWatchAndSearchByAdmin error:', error);
        return {
            isSuccess: false,
            error: {
                message: error.response?.data?.error || "An unexpected error occurred",
            },
        };
    }
};





export const getAllBrandByAdmin = async (keyword) => {
    try {
        const response = await axiosInstance.post('http://localhost:1811/api/brands/get-all', {
            keyword
        });

        // Assuming your backend response has the structure you've provided
        return {
            isSuccess: true,
            message: response.data.message, // Assuming the message is always present on successful login
            data: response.data, // Return the entire data
        };

    } catch (error) {
        console.error('Login error:', error);
        return {
            isSuccess: false,
            error: {
                message: error.response?.data?.error || "An unexpected error occurred",
            },
        };
    }
};


export const createBrandByAdmin = async (brandName) => {
    try {
        const response = await axiosInstance.post('http://localhost:1811/api/brands', {
            brandName
        });

        // Assuming your backend response has the structure you've provided
        return {
            isSuccess: true,
            message: response.data.message, // Assuming the message is always present on successful login
            data: response.data, // Return the entire data
        };

    } catch (error) {
        console.error('Login error:', error);
        return {
            isSuccess: false,
            error: {
                message: error.response?.data?.error || "An unexpected error occurred",
            },
        };
    }
};


export const editBrandByAdmin = async (id, brandData) => {
    try {
        const response = await axiosInstance.put(`http://localhost:1811/api/brands/${id}`, brandData);

        return {
            isSuccess: true,
            message: response.data.message || 'Operation successful',
            data: response.data,
        };
    } catch (error) {
        console.error('Edit brand error:', error);
        return {
            isSuccess: false,
            error: {
                message: error.response?.data?.error || 'An unexpected error occurred',
                status: error.response?.status || 500, // Optional: Get status code for more info
            },
        };
    }
};

export const deleteWatchByAdmin = async (id) => {
    try {
        const response = await axiosInstance.put(`http://localhost:1811/api/watches/delete/${id}`);

        return {
            isSuccess: true,
            message: response.data.message || 'Operation successful',
            data: response.data,
        };
    } catch (error) {
        console.error('Edit watch error:', error);
        return {
            isSuccess: false,
            error: {
                message: error.response?.data?.error || 'An unexpected error occurred',
                status: error.response?.status || 500, // Optional: Get status code for more info
            },
        };
    }
};

export const deleteBrandByAdmin = async (id) => {
    try {
        const response = await axiosInstance.put(`http://localhost:1811/api/brands/deletebrand/${id}`);

        return {
            isSuccess: true,
            message: response.data.message || 'Operation successful',
            data: response.data,
        };
    } catch (error) {
        console.error('Edit watch error:', error);
        return {
            isSuccess: false,
            error: {
                message: error.response?.data?.error || 'An unexpected error occurred',
                status: error.response?.status || 500, // Optional: Get status code for more info
            },
        };
    }
};


export const getAllMember = async (keyword) => {
    try {
        const response = await axiosInstance.post('http://localhost:1811/api/members', {
            keyword
        });

        // Assuming your backend response has the structure you've provided
        return {
            isSuccess: true,
            message: response.data.message, // Assuming the message is always present on successful login
            data: response.data, // Return the entire data
        };

    } catch (error) {
        console.error('getAllMember error:', error);
        return {
            isSuccess: false,
            error: {
                message: error.response?.data?.error || "An unexpected error occurred",
            },
        };
    }
};


export const banAccountByAdmin = async (id) => {
    try {
        const response = await axiosInstance.put(`http://localhost:1811/api/members/delete/${id}`);

        return {
            isSuccess: true,
            message: response.data.message || 'Operation successful',
            data: response.data,
        };
    } catch (error) {
        console.error('Edit watch error:', error);
        return {
            isSuccess: false,
            error: {
                message: error.response?.data?.error || 'An unexpected error occurred',
                status: error.response?.status || 500, // Optional: Get status code for more info
            },
        };
    }
};