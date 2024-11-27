import axios from 'axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router'; // Import the Next.js router for redirection

const axiosInstance = axios.create({
  baseURL: "https://www.skybeats.site/api/", // Your API base URL
  withCredentials: true, // Ensures cookies are included in requests
});

// Request Interceptor: Attach access token and validate it
axiosInstance.interceptors.request.use(
  async (config) => {
    let accessToken = Cookies.get('accessToken'); // Cookies accessible via JavaScript
    const refreshToken = Cookies.get('refreshToken');
    
    console.log('Access Token:', accessToken);
    console.log('Refresh Token:', refreshToken);

    // If there is no access token or the refresh token is missing, log the user out
    if (!accessToken || !refreshToken) {
      logoutUser();
      throw new Error('No access token or refresh token available. User needs to re-login.');
    }

    // Validate the access token by calling the /api/validateToken endpoint
    try {
      const validationResponse = await axios.post(
        `${config.baseURL}/validateToken`,
        { token: accessToken },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (validationResponse.data?.success !== true) {
        throw new Error('Access token is invalid. Refreshing token...');
      }
    } catch (validationError) {
      console.warn('Token validation failed:', validationError);

      // Retry with token refresh
      try {
        const refreshTokenResponse = await axios.post(
          `${config.baseURL}/refreshToken`,
          { refreshToken },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        accessToken = refreshTokenResponse.data?.accessToken;

        if (!accessToken) {
          throw new Error('Token refresh failed.');
        }

        // Save the new access token in cookies
        Cookies.set('accessToken', accessToken, { expires: 1 / 24, path: '/' });
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        logoutUser();
        throw refreshError; // Logout the user on refresh failure
      }
    }

    // Attach the (validated or refreshed) access token to the headers
    config.headers['Authorization'] = `Bearer ${accessToken}`;

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

// Logout function to clear cookies and redirect to the login page
function logoutUser() {
  // Clear the tokens from cookies
  Cookies.remove('accessToken');
  Cookies.remove('refreshToken');
  
  // Redirect the user to the login page (using Next.js useRouter or window.location)
  
}

export default axiosInstance;
