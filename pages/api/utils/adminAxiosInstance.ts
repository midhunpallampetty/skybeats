import axios from "axios";
import Cookies from "js-cookie";

const adminAxios = axios.create({
  baseURL: "https://www.skybeats.site/api/", // Update this to match your API base URL
  withCredentials: true,
});

// Function to verify the adminaccessToken
let cachedVerificationResult: boolean | null = null;
let lastVerificationTime: number | null = null;

const verifyAdminAccessToken = async (token: string): Promise<boolean> => {
  // Return cached result if verification was done recently (e.g., within 1 minute)
  const currentTime = Date.now();
  if (
    cachedVerificationResult !== null &&
    lastVerificationTime !== null &&
    currentTime - lastVerificationTime < 60000 // 1 minute
  ) {
    return cachedVerificationResult;
  }

  try {
    const { data } = await axios.post(
      "/api/tokenVerify",
      { token },
      { withCredentials: true }
    );
    cachedVerificationResult = data.isValid; // Cache the result
    lastVerificationTime = currentTime; // Cache the timestamp of the verification
    return cachedVerificationResult;
  } catch (error: unknown) {
    cachedVerificationResult = false; // Cache invalid result on error
    lastVerificationTime = currentTime; // Cache the timestamp of the error
    if (
      typeof error === 'object' &&
      error !== null &&
      'response' in error &&
      typeof (error as any).response === 'object' &&
      (error as any).response !== null
    ) {
      const response = (error as { response: { status: number } }).response;
      if (response.status === 500 || response.status === 404) {
        console.error("Server error during token verification. Assuming token invalid.");
      } else {
        console.error("Access token verification failed:", error);
      }
    } else if (error instanceof Error) {
      console.error("Unexpected error during token verification:", error.message);
    } else {
      console.error("Unknown error during token verification:", error);
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
