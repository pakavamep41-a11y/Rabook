/// <reference types="vite/client" />
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { useStore } from "./store";

export interface ApiErrorResponse {
  message: string;
  errors?: { [key: string]: string[] };
  code?: string;
}

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach bearer token dynamically
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle 401s and format error structures
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    // Check if error is 401 (Unauthorized) and we haven't retried yet
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt a token refresh call if token exists
        const oldToken = useStore.getState().token;
        if (oldToken) {
          // Send request with special refresh header or call refresh endpoint
          const refreshResponse = await axios.post<{ token: string }>(
            `${import.meta.env.VITE_API_URL || "/api"}/auth/refresh`,
            {},
            { headers: { Authorization: `Bearer ${oldToken}` } }
          );
          
          const newToken = refreshResponse.data.token;
          const user = useStore.getState().user;
          
          if (user && newToken) {
            useStore.getState().login(user, newToken);
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          }
        }
      } catch (refreshErr) {
        // Refresh token failed, perform logout
        useStore.getState().logout();
        useStore.getState().showAlert("نشست شما به پایان رسیده است. لطفا دوباره وارد شوید.", "error");
      }
    }

    // Format a unified Persian error message
    const customError: ApiErrorResponse = {
      message: "خطایی در برقراری ارتباط با سرور رخ داده است. مجدداً تلاش نمایید.",
    };

    if (error.response?.data) {
      if (typeof error.response.data === "string") {
        customError.message = error.response.data;
      } else if (error.response.data.message) {
        customError.message = error.response.data.message;
      }
      if (error.response.data.errors) {
        customError.errors = error.response.data.errors;
      }
      if (error.response.data.code) {
        customError.code = error.response.data.code;
      }
    } else {
      // Offline or network error
      if (error.message === "Network Error") {
        customError.message = "عدم اتصال به اینترنت. لطفا وضعیت شبکه خود را بررسی کنید.";
      }
    }

    return Promise.reject(customError);
  }
);
