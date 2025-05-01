import api from '../utils/api';
import { ID } from '../types/common.types';
import { GenderSuitability } from '../types/carrier.types';

export interface Place {
  id: ID;
  facilityId: ID;
  categoryId: ID;
  name: string;
  isOccupied: boolean;
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

export interface PlaceListResponse {
  data: Place[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface PlaceFilter {
  categoryId?: string;
  isOccupied?: boolean;
  genderSuitability?: GenderSuitability;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkPlaceCreationParams {
  categoryId: string;
  count: number;
  genderSuitability: GenderSuitability;
  minAge: number;
  maxAge: number;
}

/**
 * Get places by facility with pagination and filtering
 */
export const getPlacesByFacility = async (
  facilityId: string,
  page = 1,
  limit = 10,
  filters: PlaceFilter = {}
): Promise<PlaceListResponse> => {
  const queryParams = new URLSearchParams();

  queryParams.append('page', page.toString());
  queryParams.append('limit', limit.toString());

  if (filters.categoryId) {
    queryParams.append('categoryId', filters.categoryId);
  }

  if (filters.isOccupied !== undefined) {
    queryParams.append('isOccupied', filters.isOccupied.toString());
  }

  if (filters.genderSuitability) {
    queryParams.append('genderSuitability', filters.genderSuitability);
  }

  if (filters.sortBy) {
    queryParams.append('sortBy', filters.sortBy);
  }

  if (filters.sortOrder) {
    queryParams.append('sortOrder', filters.sortOrder);
  }

  return api.get<PlaceListResponse>(`/carrier/facilities/${facilityId}/places?${queryParams.toString()}`);
};

/**
 * Get place by ID
 */
export const getPlaceById = async (id: string): Promise<Place> => {
  return api.get<Place>(`/carrier/places/${id}`);
};

/**
 * Create a new place
 */
export const createPlace = async (placeData: Partial<Place>): Promise<Place> => {
  if (!placeData.facilityId) {
    throw new Error('Facility ID is required');
  }

  // Use the correct endpoint for creating places
  return api.post<Place>(`/carrier/places`, placeData);
};

/**
 * Update a place
 */
export const updatePlace = async (id: string, placeData: Partial<Place>): Promise<Place> => {
  return api.put<Place>(`/carrier/places/${id}`, placeData);
};

/**
 * Delete a place
 */
export const deletePlace = async (id: string): Promise<void> => {
  return api.delete(`/carrier/places/${id}`);
};

/**
 * Toggle place occupation status
 */
export const togglePlaceOccupation = async (id: string): Promise<Place> => {
  // Use the dedicated endpoint for toggling occupation
  return api.patch<Place>(`/carrier/places/${id}/toggle-occupation`);
};

/**
 * Update place gender suitability
 */
export const updatePlaceGenderSuitability = async (
  id: string,
  genderSuitability: GenderSuitability
): Promise<Place> => {
  // Use the dedicated endpoint for updating gender suitability
  return api.patch<Place>(`/carrier/places/${id}/gender-suitability`, { genderSuitability });
};

/**
 * Bulk create places
 */
export const bulkCreatePlaces = async (
  facilityId: string,
  params: BulkPlaceCreationParams
): Promise<{ count: number; data: Place[] }> => {
  return api.post<{ count: number; data: Place[] }>(`/carrier/facilities/${facilityId}/places/bulk`, params);
};

export const placeService = {
  getPlacesByFacility,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  togglePlaceOccupation,
  updatePlaceGenderSuitability,
  bulkCreatePlaces,
};

export default placeService;
