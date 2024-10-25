import { axiosInstance } from '../service/customize-axios';

export const getLab = async (payload) => {
    try {
        const response = await axiosInstance.post('/kit/search', payload);
        return response; // The interceptor returns only the data, so this is equivalent to returning response.data
    } catch (error) {
        console.error("Error fetching data: ", error);
        throw error; // Throw the error for handling in the component
    }
};







// Function to fetch data from the API








// import axios from './customize-axios';

// const fetchAllUser = () => {
//     return axios.get("/api/user?page=1");
// }

// const loginApi = (email, password, accessToken) => {
//     return axios.post("/api/Auth/sign-in", { email, password }); 
// } 

// export { loginApi }


// export const getWatchAndSearch = async (keyword) => {
//     try {
//         const response = await axiosInstance.post('http://localhost:1811/api/watches/client/get-all', {
//             keyword
//         });

//         // Assuming your backend response has the structure you've provided
//         return {
//             isSuccess: true,
//             message: response.data.message, // Assuming the message is always present on successful login
//             data: response.data, // Return the entire data
//         };

//     } catch (error) {
//         console.error('Login error:', error);
//         return {
//             isSuccess: false,
//             error: {
//                 message: error.response?.data?.error || "An unexpected error occurred",
//             },
//         };
//     }
// };


// export const getWatchDetail = async (id) => {
//     try {
//         // Use template literals correctly for URL
//         const response = await axiosInstance.get(`http://localhost:1811/api/watches/${id}`, {
//         });

//         // Return structured response
//         return {
//             isSuccess: true,
//             message: response.data.message || 'Operation successful', // Provide a default message if none exists
//             data: response.data,
//         };

//     } catch (error) {
//         console.error('Fetch watch detail error:', error); // Change the log message to be more specific
//         return {
//             isSuccess: false,
//             error: {
//                 message: error.response?.data?.error || 'An unexpected error occurred',
//             },
//         };
//     }
// };


// export const changePassword = async (id, password) => {
//     try {
//         // Use template literals correctly for URL
//         const response = await axiosInstance.put(`http://localhost:1811/api/members/change-password`, {
//             id,
//             password
//         });

//         // Return structured response
//         return {
//             isSuccess: true,
//             message: response.data.message || 'Change Password successful', // Provide a default message if none exists
//             data: response.data,
//         };

//     } catch (error) {
//         console.error('Fetch watch detail error:', error); // Change the log message to be more specific
//         return {
//             isSuccess: false,
//             error: {
//                 message: error.response?.data?.error || 'An unexpected error occurred',
//             },
//         };
//     }
// };

// export const getProfile = async (id) => {
//     try {
//         // Use template literals correctly for URL
//         const response = await axiosInstance.get(`http://localhost:1811/api/members/${id}`, {
//         });

//         // Return structured response
//         return {
//             isSuccess: true,
//             message: response.data.message || 'Operation successful', // Provide a default message if none exists
//             data: response.data,
//         };

//     } catch (error) {
//         console.error('Fetch getProfile error:', error); // Change the log message to be more specific
//         return {
//             isSuccess: false,
//             error: {
//                 message: error.response?.data?.error || 'An unexpected error occurred',
//             },
//         };
//     }
// };

// export const updateProfile = async (id, phoneNumber, YOB, name) => {
//     try {
//         // Use template literals correctly for URL
//         const response = await axiosInstance.put(`http://localhost:1811/api/members/edit/${id}`, {
//             phoneNumber,
//             YOB,
//             name
//         });

//         // Return structured response
//         return {
//             isSuccess: true,
//             message: response.data.message || 'Operation successful', // Provide a default message if none exists
//             data: response.data,
//         };

//     } catch (error) {
//         console.error('Fetch getProfile error:', error); // Change the log message to be more specific
//         return {
//             isSuccess: false,
//             error: {
//                 message: error.response?.data?.error || 'An unexpected error occurred',
//             },
//         };
//     }
// };



// export const commentWatch = async (content, author, rating, watchID) => {
//     try {
//         // Use template literals correctly for URL
//         const response = await axiosInstance.post(`http://localhost:1811/api/members/comment/${watchID}`, {
//             content,
//             author,
//             rating,
//         });

//         // Return structured response
//         return {
//             isSuccess: true,
//             message: response.data.message || 'Operation successful', // Provide a default message if none exists
//             data: response.data,
//         };

//     } catch (error) {
//         console.error('Fetch watch detail error:', error); // Change the log message to be more specific
//         return {
//             isSuccess: false,
//             error: {
//                 message: error.response?.data?.error || 'An unexpected error occurred',
//             },
//         };
//     }
// };



// export const ViewToySale = async (pageIndex, pageSize) => {
//     try {
//         // Construct the API URL dynamically based on passed arguments
//         const url = `https://localhost:7221/api/Toy/ViewToysSale?pageIndex=${pageIndex}&pageSize=${pageSize}`;

//         // Call the API to get toy rental data
//         const response = await axiosInstance.get(url, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         // Check if the response indicates success
//         if (response.status === 200) {
//             const responseData = response.data;

//             // Check if response data contains the necessary fields
//             if (responseData && responseData.items) {
//                 return responseData.items; // Return the list of toys from the response
//             } else {
//                 throw new Error('No toy data found.');
//             }
//         } else {
//             throw new Error('Failed to retrieve toy rental data.');
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             // Handle validation errors returned from the backend
//             const validationErrors = error.response.data.errors;

//             // Create a new Error object and attach validation errors to it
//             const validationError = new Error('Validation errors occurred');
//             validationError.validationErrors = Object.keys(validationErrors).reduce((acc, key) => {
//                 acc[key] = validationErrors[key].join(' '); // Join multiple messages if any
//                 return acc;
//             }, {});

//             throw validationError; // Throw the error object with validation data
//         }
//         console.error('Error retrieving toy rental data:', error);
//         throw error; // Re-throw the original error if not validation-related
//     }
// };


// export const SearchToyRent = async (keyword, pageIndex, pageSize) => {
//     try {
//         // Construct the API URL dynamically based on passed arguments
//         const url = `https://localhost:7221/api/Toy/search/rent?keyword=${keyword}&pageIndex=${pageIndex}&pageSize=${pageSize}`;

//         // Call the API to get toy rental data
//         const response = await axiosInstance.get(url, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         // Check if the response indicates success
//         if (response.status === 200) {
//             const responseData = response.data;

//             // Check if response data contains the necessary fields
//             if (responseData && responseData.items) {
//                 return responseData.items; // Return the list of toys from the response
//             } else {
//                 throw new Error('No toy data found.');
//             }
//         } else {
//             throw new Error('Failed to retrieve toy rental data.');
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             // Handle validation errors returned from the backend
//             const validationErrors = error.response.data.errors;

//             // Create a new Error object and attach validation errors to it
//             const validationError = new Error('Validation errors occurred');
//             validationError.validationErrors = Object.keys(validationErrors).reduce((acc, key) => {
//                 acc[key] = validationErrors[key].join(' '); // Join multiple messages if any
//                 return acc;
//             }, {});

//             throw validationError; // Throw the error object with validation data
//         }
//         console.error('Error retrieving toy rental data:', error);
//         throw error; // Re-throw the original error if not validation-related
//     }
// };

// export const SearchToySale = async (keyword,pageIndex, pageSize) => {
//     try {
//         // Construct the API URL dynamically based on passed arguments
//         const url = `https://localhost:7221/api/Toy/search/sale?keyword=${keyword}&pageIndex=${pageIndex}&pageSize=${pageSize}`;

//         // Call the API to get toy rental data
//         const response = await axiosInstance.get(url, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         // Check if the response indicates success
//         if (response.status === 200) {
//             const responseData = response.data;

//             // Check if response data contains the necessary fields
//             if (responseData && responseData.items) {
//                 return responseData.items; // Return the list of toys from the response
//             } else {
//                 throw new Error('No toy data found.');
//             }
//         } else {
//             throw new Error('Failed to retrieve toy rental data.');
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             // Handle validation errors returned from the backend
//             const validationErrors = error.response.data.errors;

//             // Create a new Error object and attach validation errors to it
//             const validationError = new Error('Validation errors occurred');
//             validationError.validationErrors = Object.keys(validationErrors).reduce((acc, key) => {
//                 acc[key] = validationErrors[key].join(' '); // Join multiple messages if any
//                 return acc;
//             }, {});

//             throw validationError; // Throw the error object with validation data
//         }
//         console.error('Error retrieving toy rental data:', error);
//         throw error; // Re-throw the original error if not validation-related
//     }
// };

// export const SortToyRent = async (sortoption, pageIndex, pageSize) => {
//     try {
//         // Construct the API URL dynamically based on passed arguments
//         const url = `https://localhost:7221/api/Toy/SortToysForRent?sortBy=${sortoption}&pageIndex=${pageIndex}&pageSize=${pageSize}`;

//         // Call the API to get toy rental data
//         const response = await axiosInstance.get(url, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         // Check if the response indicates success
//         if (response.status === 200) {
//             const responseData = response.data;

//             // Check if response data contains the necessary fields
//             if (responseData && responseData.items) {
//                 return responseData.items; // Return the list of toys from the response
//             } else {
//                 throw new Error('No toy data found.');
//             }
//         } else {
//             throw new Error('Failed to retrieve toy rental data.');
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             // Handle validation errors returned from the backend
//             const validationErrors = error.response.data.errors;

//             // Create a new Error object and attach validation errors to it
//             const validationError = new Error('Validation errors occurred');
//             validationError.validationErrors = Object.keys(validationErrors).reduce((acc, key) => {
//                 acc[key] = validationErrors[key].join(' '); // Join multiple messages if any
//                 return acc;
//             }, {});

//             throw validationError; // Throw the error object with validation data
//         }
//         console.error('Error retrieving toy rental data:', error);
//         throw error; // Re-throw the original error if not validation-related
//     }
// };



// export const GetCart = async () => {
//   try {
//     // Construct the API URL dynamically based on passed arguments
//     const url = `https://localhost:7221/api/Cart/rental-cart`;

//     // Call the API to get toy rental data
//     const response = await axiosInstance.get(url, {
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     // Check if the response indicates success
//     if (response.status === 200 && response.data.isSuccess) {
//       const responseData = response.data;

//       // Check if the 'object' array contains data
//       if (responseData && responseData.object) {
//         return responseData.object; // Return the array of cart items
//       } else {
//         throw new Error('No cart data found.');
//       }
//     } else {
//       throw new Error('Failed to retrieve cart data.');
//     }
//   } catch (error) {
//     if (error.response && error.response.data.errors) {
//       // Handle validation errors returned from the backend
//       const validationErrors = error.response.data.errors;

//       // Create a new Error object and attach validation errors to it
//       const validationError = new Error('Validation errors occurred');
//       validationError.validationErrors = Object.keys(validationErrors).reduce((acc, key) => {
//         acc[key] = validationErrors[key].join(' '); // Join multiple messages if any
//         return acc;
//       }, {});

//       throw validationError; // Throw the error object with validation data
//     }
//     console.error('Error retrieving cart data:', error);
//     throw error; // Re-throw the original error if not validation-related
//   }
// };

// export const GetCart2 = async () => {
//     try {
//       // Construct the API URL dynamically based on passed arguments
//       const url = `https://localhost:7221/api/Cart/sale-cart`;

//       // Call the API to get toy rental data
//       const response = await axiosInstance.get(url, {
//         headers: {
//           'Content-Type': 'application/json',
//         },
//       });

//       // Check if the response indicates success
//       if (response.status === 200 && response.data.isSuccess) {
//         const responseData = response.data;

//         // Check if the 'object' array contains data
//         if (responseData && responseData.object) {
//           return responseData.object; // Return the array of cart items
//         } else {
//           throw new Error('No cart data found.');
//         }
//       } else {
//         throw new Error('Failed to retrieve cart data.');
//       }
//     } catch (error) {
//       if (error.response && error.response.data.errors) {
//         // Handle validation errors returned from the backend
//         const validationErrors = error.response.data.errors;

//         // Create a new Error object and attach validation errors to it
//         const validationError = new Error('Validation errors occurred');
//         validationError.validationErrors = Object.keys(validationErrors).reduce((acc, key) => {
//           acc[key] = validationErrors[key].join(' '); // Join multiple messages if any
//           return acc;
//         }, {});

//         throw validationError; // Throw the error object with validation data
//       }
//       console.error('Error retrieving cart data:', error);
//       throw error; // Re-throw the original error if not validation-related
//     }
//   };


// export const getToyByID = async (id) => {
//     try {
//         // Call the API to get the toy by its ID
//         const response = await axiosInstance.get(`https://localhost:7221/api/Toy/${id}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         // Check if the response indicates success
//         if (response.data.isSuccess) {
//             return response.data.object; // Return the toy object from the response
//         } else {
//             throw new Error('Failed to retrieve toy.'); // Handle generic failure cases
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             // Handle validation errors returned from the backend
//             const validationErrors = error.response.data.errors;

//             // Create a new Error object and attach validation errors to it
//             const validationError = new Error('Validation errors occurred');
//             validationError.validationErrors = Object.keys(validationErrors).reduce((acc, key) => {
//                 acc[key] = validationErrors[key].join(' '); // Join multiple messages if any
//                 return acc;
//             }, {});

//             throw validationError; // Throw the error object with validation data
//         }
//         console.error('Error retrieving toy:', error);
//         throw error; // Re-throw the original error if not validation-related
//     }
// };



// export const AddToCart = async (toyId, quantity) => {
//     try {
//         // Call the API to add item to cart
//         const response = await axiosInstance.post('https://localhost:7221/api/Cart/add-item-to-cart', {
//             toyId,
//             quantity,
//         });

//         // Check if the response indicates success
//         if (response.data.isSuccess) {
//             return response.data.object; // Return the added cart item
//         } else {
//             throw new Error('Failed to add item to cart.'); // Handle generic failure cases
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             // Handle validation errors returned from the backend
//             const validationErrors = error.response.data.errors;

//             // Create a new Error object and attach validation errors to it
//             const validationError = new Error('Validation errors occurred');
//             validationError.validationErrors = Object.keys(validationErrors).reduce((acc, key) => {
//                 acc[key] = validationErrors[key].join(' '); // Join multiple messages if any
//                 return acc;
//             }, {});

//             throw validationError; // Throw the error object with validation data
//         }

//         console.error('Error adding item to cart:', error);
//         throw error; // Re-throw the original error if not validation-related
//     }
// };

export const AddToCart2 = async (
    toyId,
    quantity = 1,
) => {
    try {
        // Create form data object to handle file uploads
        const formData = new FormData();
        formData.append('toyId', toyId);
        formData.append('quantity', quantity);

        // Make the API request with axiosInstance
        const response = await axiosInstance.post('https://localhost:7221/api/Cart/add-item-to-cart', formData, {
            headers: {
                'Content-Type': 'multipart/form-data', // Ensure multipart/form-data is used
            },
        });

        // Return the response data if successful
        if (response.data.isSuccess) {
            return response.data;  // You can also return specific response data fields here
        } else {
            throw new Error('Submission failed. Please check the form data.');
        }
    } catch (error) {
        // Catch and rethrow any errors from the API call
        if (error.response && error.response.data) {
            throw new Error(error.response.data.error.message || 'An error occurred while submitting the form.');
        } else {
            throw new Error('Network error or server is unreachable.');
        }
    }
};


//   export const UserGetToyByID = async (id) => {
//     try {
//         // Call the API to get the toy by its ID
//         const response = await axiosInstance.get(`https://localhost:7221/api/Toy/${id}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         // Check if the response indicates success
//         if (response.data.isSuccess) {
//             return response.data.object; // Return the toy object from the response
//         } else {
//             throw new Error('Failed to retrieve toy.'); // Handle generic failure cases
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             // Handle validation errors returned from the backend
//             const validationErrors = error.response.data.errors;

//             // Create a new Error object and attach validation errors to it
//             const validationError = new Error('Validation errors occurred');
//             validationError.validationErrors = Object.keys(validationErrors).reduce((acc, key) => {
//                 acc[key] = validationErrors[key].join(' '); // Join multiple messages if any
//                 return acc;
//             }, {});

//             throw validationError; // Throw the error object with validation data
//         }
//         console.error('Error retrieving toy:', error);
//         throw error; // Re-throw the original error if not validation-related
//     }
// };




// export const OrderRentToys = async (shippingAddress, receivePhoneNumber, isRentalOrder, toyList, rentalDate, returnDate) => {
//     try {
//         // Call the API to post the order
//         const response = await axiosInstance.post('https://localhost:7221/api/Order', {
//             shippingAddress,          // Address where the order will be shipped
//             receivePhoneNumber,       // Phone number to contact
//             isRentalOrder,            // Boolean or value indicating if this is a rental order
//             toyList,                  // Array of toy objects (with toyId and quantity)
//             rentalDate,               // Start date for the rental
//             returnDate                // Return date for the rental
//         });

//         // Check if the response indicates success
//         if (response.data.isSuccess) {
//             return response.data.object; // Return the response object if success
//         } else {
//             throw new Error('Failed to place order.'); // Handle generic failure cases
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             // Handle validation errors returned from the backend
//             const validationErrors = error.response.data.errors;

//             // Create a new Error object and attach validation errors to it
//             const validationError = new Error('Validation errors occurred');
//             validationError.validationErrors = Object.keys(validationErrors).reduce((acc, key) => {
//                 acc[key] = validationErrors[key].join(' '); // Join multiple messages if any
//                 return acc;
//             }, {});

//             throw validationError; // Throw the error object with validation data
//         }
//         console.error('Error placing order:', error);
//         throw error; // Re-throw the original error if not validation-related
//     }
// };


// export const UserOrderCart = async (id) => {
//     try {
//         // Call the API to get the toy by its ID
//         const response = await axiosInstance.get(`https://localhost:7221/user/${id}`, {
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });

//         // Check if the response indicates success
//         if (response.data.isSuccess) {
//             return response.data.object; // Return the toy object from the response
//         } else {
//             throw new Error('Failed to retrieve toy.'); // Handle generic failure cases
//         }
//     } catch (error) {
//         if (error.response && error.response.data.errors) {
//             // Handle validation errors returned from the backend
//             const validationErrors = error.response.data.errors;

//             // Create a new Error object and attach validation errors to it
//             const validationError = new Error('Validation errors occurred');
//             validationError.validationErrors = Object.keys(validationErrors).reduce((acc, key) => {
//                 acc[key] = validationErrors[key].join(' '); // Join multiple messages if any
//                 return acc;
//             }, {});

//             throw validationError; // Throw the error object with validation data
//         }
//         console.error('Error retrieving toy:', error);
//         throw error; // Re-throw the original error if not validation-related
//     }
// };





