import { useState, useCallback, useEffect } from 'react';
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import useAuth from './useAuth';
import useNotification from './useNotification';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error | AxiosError) => void;
  showSuccessNotification?: boolean;
  showErrorNotification?: boolean;
  successMessage?: string;
}

export function useApi<T = any>() {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | AxiosError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const { token, refreshAuthToken, logout } = useAuth();
  const { showSuccess, showError } = useNotification();

  // Set up request interceptor for auth token
  useEffect(() => {
    const requestInterceptor = api.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Set up response interceptor for token refresh
    const responseInterceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        // If error is 401 and we haven't tried to refresh the token yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            // Try to refresh the token
            await refreshAuthToken();
            
            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          } catch (refreshError) {
            // If refresh fails, logout and reject with the original error
            logout();
            return Promise.reject(error);
          }
        }
        
        return Promise.reject(error);
      }
    );

    // Clean up interceptors on unmount
    return () => {
      api.interceptors.request.eject(requestInterceptor);
      api.interceptors.response.eject(responseInterceptor);
    };
  }, [token, refreshAuthToken, logout]);

  const request = useCallback(
    async <R = T>(
      config: AxiosRequestConfig,
      options: UseApiOptions<R> = {}
    ): Promise<R | null> => {
      const {
        onSuccess,
        onError,
        showSuccessNotification = false,
        showErrorNotification = true,
        successMessage,
      } = options;

      setIsLoading(true);
      setError(null);

      try {
        const response: AxiosResponse<R> = await api(config);
        setData(response.data as unknown as T);
        
        if (onSuccess) {
          onSuccess(response.data);
        }
        
        if (showSuccessNotification && successMessage) {
          showSuccess(successMessage);
        }
        
        setIsLoading(false);
        return response.data;
      } catch (err) {
        const error = err as Error | AxiosError;
        setError(error);
        
        if (onError) {
          onError(error);
        }
        
        if (showErrorNotification) {
          const message = axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : error.message || 'Ein unerwarteter Fehler ist aufgetreten';
          
          showError(message);
        }
        
        setIsLoading(false);
        return null;
      }
    },
    [showSuccess, showError]
  );

  const get = useCallback(
    <R = T>(url: string, params?: any, options?: UseApiOptions<R>) => {
      return request<R>({ method: 'GET', url, params }, options);
    },
    [request]
  );

  const post = useCallback(
    <R = T>(url: string, data?: any, options?: UseApiOptions<R>) => {
      return request<R>({ method: 'POST', url, data }, options);
    },
    [request]
  );

  const put = useCallback(
    <R = T>(url: string, data?: any, options?: UseApiOptions<R>) => {
      return request<R>({ method: 'PUT', url, data }, options);
    },
    [request]
  );

  const patch = useCallback(
    <R = T>(url: string, data?: any, options?: UseApiOptions<R>) => {
      return request<R>({ method: 'PATCH', url, data }, options);
    },
    [request]
  );

  const del = useCallback(
    <R = T>(url: string, options?: UseApiOptions<R>) => {
      return request<R>({ method: 'DELETE', url }, options);
    },
    [request]
  );

  return {
    data,
    error,
    isLoading,
    request,
    get,
    post,
    put,
    patch,
    del,
  };
}

export default useApi;
