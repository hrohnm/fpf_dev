/**
 * API utility functions for making HTTP requests
 */

// Base API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

// Default headers for JSON requests
const defaultHeaders = {
  'Content-Type': 'application/json',
};

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Generic fetch function with error handling
const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_URL}${endpoint}`;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      // Try to parse error message from response
      try {
        const errorData = await response.json();
        throw new Error(errorData.message || `API error: ${response.status}`);
      } catch (e) {
        throw new Error(`API error: ${response.status}`);
      }
    }

    // Check if response is empty
    const text = await response.text();
    return text ? JSON.parse(text) : {};
  } catch (error) {
    console.error(`API request failed: ${url}`, error);
    throw error;
  }
};

// GET request
export const get = <T>(endpoint: string, authenticated = true): Promise<T> => {
  const headers = authenticated
    ? { ...defaultHeaders, ...getAuthHeaders() }
    : defaultHeaders;

  return fetchApi<T>(endpoint, {
    method: 'GET',
    headers,
  });
};

// POST request
export const post = <T>(
  endpoint: string,
  data: any,
  authenticated = true
): Promise<T> => {
  const headers = authenticated
    ? { ...defaultHeaders, ...getAuthHeaders() }
    : defaultHeaders;

  return fetchApi<T>(endpoint, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
};

// PUT request
export const put = <T>(
  endpoint: string,
  data: any,
  authenticated = true
): Promise<T> => {
  const headers = authenticated
    ? { ...defaultHeaders, ...getAuthHeaders() }
    : defaultHeaders;

  return fetchApi<T>(endpoint, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
};

// DELETE request
export const del = <T>(endpoint: string, authenticated = true): Promise<T> => {
  const headers = authenticated
    ? { ...defaultHeaders, ...getAuthHeaders() }
    : defaultHeaders;

  return fetchApi<T>(endpoint, {
    method: 'DELETE',
    headers,
  });
};

// PATCH request
export const patch = <T>(
  endpoint: string,
  data?: any,
  authenticated = true
): Promise<T> => {
  const headers = authenticated
    ? { ...defaultHeaders, ...getAuthHeaders() }
    : defaultHeaders;

  return fetchApi<T>(endpoint, {
    method: 'PATCH',
    headers,
    body: data ? JSON.stringify(data) : undefined,
  });
};

// Export default object with all methods
export default {
  get,
  post,
  put,
  patch,
  delete: del,
};
