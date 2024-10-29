import { axiosInstance } from './customize-axios';

export const login = async (memberName, password) => {
  try {
    const response = await axiosInstance.post('http://localhost:1811/api/auth/login', {
      memberName,
      password,
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

//  const [keyword, setKeyword] = useState('');
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSearch = async () => {
//     setLoading(true);
//     setError(null); // Reset error state before the search

//     const response = await getWatchAndSearch(keyword);

//     setLoading(false);

//     if (response.isSuccess) {
//       setResult(response.data);
//     } else {
//       setError(response.error.message);
//     }
//   };



export const signup = async (name, password, role, phone) => {
  try {
    const response = await axiosInstance.post('http://localhost:1811/api/auth/register', {
      memberName: name,
      password,
      name: role,
      phoneNumber: phone,
    });

    // Assuming your backend response has the structure you've provided
    if (response.data && response.data.message) {
      return {
        isSuccess: true,
        message: response.data.message,
        data: response.data.data,
      };
    } else {
      return {
        isSuccess: false,
        error: {
          message: response.data.error || "Registration failed",
        },
      };
    }
  } catch (error) {
    console.error('Signup error:', error);
    return {
      isSuccess: false,
      error: {
        message: error.response?.data?.error || "An unexpected error occurred",
      },
    };
  }
};



