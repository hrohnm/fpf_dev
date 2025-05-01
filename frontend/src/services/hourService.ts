import api from '../utils/api';
import { ID } from '../types/common.types';
import { GenderSuitability } from '../types/carrier.types';

export interface Hour {
  id: ID;
  facilityId: ID;
  categoryId: ID;
  name: string;
  totalHours: number;
  availableHours: number;
  genderSuitability: GenderSuitability;
  minAge: number;
  maxAge: number;
  notes?: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: ID;
    name: string;
  };
}

export interface HourListResponse {
  data: Hour[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface HourFilter {
  categoryId?: string;
  genderSuitability?: GenderSuitability;
  minAvailableHours?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkHourCreationParams {
  categoryId: string;
  name: string;
  totalHours: number;
  availableHours: number;
  genderSuitability: GenderSuitability;
  minAge: number;
  maxAge: number;
}

/**
 * Get hours by facility with pagination and filtering
 */
export const getHoursByFacility = async (
  facilityId: string,
  page = 1,
  limit = 10,
  filters: HourFilter = {}
): Promise<HourListResponse> => {
  const queryParams = new URLSearchParams();
  
  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());
  
  if (filters.categoryId) {
    queryParams.append('categoryId', filters.categoryId);
  }
  
  if (filters.genderSuitability) {
    queryParams.append('genderSuitability', filters.genderSuitability);
  }
  
  if (filters.minAvailableHours !== undefined) {
    queryParams.append('minAvailableHours', filters.minAvailableHours.toString());
  }
  
  if (filters.sortBy) {
    queryParams.append('sortBy', filters.sortBy);
  }
  
  if (filters.sortOrder) {
    queryParams.append('sortOrder', filters.sortOrder);
  }
  
  return api.get<HourListResponse>(`/carrier/facilities/${facilityId}/hours?${queryParams.toString()}`);
};

/**
 * Get hour by ID
 */
export const getHourById = async (id: string): Promise<Hour> => {
  return api.get<Hour>(`/carrier/hours/${id}`);
};

/**
 * Create a new hour entry
 */
export const createHour = async (hourData: Partial<Hour>): Promise<Hour> => {
  if (!hourData.facilityId) {
    throw new Error('Facility ID is required');
  }
  
  const facilityId = hourData.facilityId;
  const data = { ...hourData };
  delete data.facilityId;
  
  return api.post<Hour>(`/carrier/facilities/${facilityId}/hours`, data);
};

/**
 * Update an hour entry
 */
export const updateHour = async (id: string, hourData: Partial<Hour>): Promise<Hour> => {
  return api.put<Hour>(`/carrier/hours/${id}`, hourData);
};

/**
 * Delete an hour entry
 */
export const deleteHour = async (id: string): Promise<void> => {
  return api.delete(`/carrier/hours/${id}`);
};

/**
 * Update available hours
 */
export const updateAvailableHours = async (id: string, availableHours: number): Promise<Hour> => {
  return api.patch<Hour>(`/carrier/hours/${id}/available`, { availableHours });
};

/**
 * Bulk create hours
 */
export const bulkCreateHours = async (
  facilityId: string, 
  params: BulkHourCreationParams
): Promise<Hour> => {
  return api.post<Hour>(`/carrier/facilities/${facilityId}/hours/bulk`, params);
};

export const hourService = {
  getHoursByFacility,
  getHourById,
  createHour,
  updateHour,
  deleteHour,
  updateAvailableHours,
  bulkCreateHours,
};

export default hourService;
