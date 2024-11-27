import axios from "axios";
import Cookies from "js-cookie";

const adminAxios = axios.create({
  baseURL: "https://www.skybeats.site/api/", // Update this to match your API base URL
  withCredentials: true,
});

// Function to verify the adminaccessToken
const verifyAdminAccessToken = async (token:any) => {
  try {
    const { data } = await axios.post(
      "/api/verifyAccessToken",
      { token },
      { withCredentials: true }
    );
    return data.isValid; // Assuming API returns an `isValid` field
  } catch (error:any) {
    if (error.response?.status === 500 || error.response?.status === 404) {
      console.error("Server error during token verification. Assuming token invalid.");
    } else {
      console.error("Access token verification failed:", error);
    }
    return false; // Treat as invalid if any error occurs
  }
};

// Request interceptor to attach access token to headers
adminAxios.interceptors.request.use(
  async (config) => {
    let adminaccessToken = Cookies.get("adminaccessToken"); // Get access token from cookies

    // Verify the token before attaching it
    if (adminaccessToken) {
      const isValid = await verifyAdminAccessToken(adminaccessToken);
      if (!isValid) {
        // If invalid, try refreshing the token
        const adminrefreshToken = Cookies.get("adminrefreshToken");
        if (adminrefreshToken) {
          try {
            const { data } = await axios.post(
              "/api/adminRefresh",
              { adminrefreshToken },
              { withCredentials: true }
            );

            // Set the new access token in cookies
            adminaccessToken = data.adminaccessToken;
            Cookies.set("adminaccessToken", adminaccessToken, {
              secure: true,
              sameSite: "strict",
            });
          } catch (refreshError) {
            console.error("Failed to refresh token:", refreshError);
            Cookies.remove("adminaccessToken");
            Cookies.remove("adminrefreshToken");
            window.location.href = "/admin/signin";
            throw refreshError;
          }
        } else {
          // If no refresh token exists, redirect to login
          console.error("No refresh token available.");
          window.location.href = "/admin/signin";
          throw new Error("Unauthorized: No refresh token.");
        }
      }
    }

    // Attach the token to headers
    if (adminaccessToken) {
      config.headers.Authorization = `Bearer ${adminaccessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 errors
adminAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const adminrefreshToken = Cookies.get("adminrefreshToken");

    if (error.response?.status === 401 && adminrefreshToken && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { data } = await axios.post(
          "/api/adminRefresh",
          { adminrefreshToken },
          { withCredentials: true }
        );

        // Update cookies and retry request
        Cookies.set("adminaccessToken", data.adminaccessToken, {
          secure: true,
          sameSite: "strict",
        });

        originalRequest.headers.Authorization = `Bearer ${data.adminaccessToken}`;
        return adminAxios(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        Cookies.remove("adminaccessToken");
        Cookies.remove("adminrefreshToken");
        window.location.href = "/admin/signin";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default adminAxios;
