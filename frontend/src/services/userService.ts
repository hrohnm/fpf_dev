import api from '../utils/api';
import { User } from '../types/auth.types';

export interface UserListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface UserFilters {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Get all users with pagination and filtering
 */
export const getUsers = async (filters: UserFilters = {}): Promise<UserListResponse> => {
  // Convert filters to query string
  const queryParams = new URLSearchParams();
  
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.role) queryParams.append('role', filters.role);
  if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
  if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
  
  const queryString = queryParams.toString();
  const endpoint = `/admin/users${queryString ? `?${queryString}` : ''}`;
  
  return api.get<UserListResponse>(endpoint);
};

/**
 * Get user by ID
 */
export const getUserById = async (id: string): Promise<User> => {
  return api.get<User>(`/admin/users/${id}`);
};

/**
 * Create a new user
 */
export const createUser = async (userData: any): Promise<User> => {
  return api.post<User>('/admin/users', userData);
};

/**
 * Update a user
 */
export const updateUser = async (id: string, userData: any): Promise<User> => {
  return api.put<User>(`/admin/users/${id}`, userData);
};

/**
 * Delete a user
 */
export const deleteUser = async (id: string): Promise<void> => {
  return api.delete(`/admin/users/${id}`);
};

export default {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
