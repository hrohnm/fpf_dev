import api from '../utils/api';
import { Place, PlaceFilter, PaginatedResponse } from '../types';

export const placeService = {
  /**
   * Get places by facility ID
   */
  getPlacesByFacility: async (
    facilityId: string,
    page = 1,
    limit = 10,
    filters?: PlaceFilter,
    sortBy = 'name',
    sortOrder: 'asc' | 'desc' = 'asc'
  ): Promise<PaginatedResponse<Place>> => {
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      sortBy,
      sortOrder,
    });

    if (filters) {
      if (filters.categoryId) {
        queryParams.append('categoryId', filters.categoryId);
      }
      if (filters.isOccupied !== undefined) {
        queryParams.append('isOccupied', filters.isOccupied.toString());
      }
      if (filters.genderSuitability) {
        queryParams.append('genderSuitability', filters.genderSuitability);
      }
    }

    const response = await api.get(`/carrier/facilities/${facilityId}/places?${queryParams.toString()}`);
    return response.data;
  },

  /**
   * Get place by ID
   */
  getPlaceById: async (id: string): Promise<Place> => {
    const response = await api.get(`/carrier/places/${id}`);
    return response.data;
  },

  /**
   * Create a new place
   */
  createPlace: async (place: Partial<Place>): Promise<Place> => {
    const response = await api.post('/carrier/places', place);
    return response.data;
  },

  /**
   * Update a place
   */
  updatePlace: async (id: string, place: Partial<Place>): Promise<Place> => {
    const response = await api.put(`/carrier/places/${id}`, place);
    return response.data;
  },

  /**
   * Toggle place occupation status
   */
  togglePlaceOccupation: async (id: string): Promise<Place> => {
    const response = await api.patch(`/carrier/places/${id}/toggle-occupation`);
    return response.data;
  },

  /**
   * Update place gender suitability
   */
  updatePlaceGenderSuitability: async (id: string, genderSuitability: 'male' | 'female' | 'all'): Promise<Place> => {
    const response = await api.patch(`/carrier/places/${id}/gender-suitability`, { genderSuitability });
    return response.data;
  },

  /**
   * Delete a place
   */
  deletePlace: async (id: string): Promise<void> => {
    await api.delete(`/carrier/places/${id}`);
  },

  /**
   * Get place statistics for a facility
   */
  getPlaceStatistics: async (facilityId: string): Promise<any> => {
    const response = await api.get(`/carrier/facilities/${facilityId}/places/statistics`);
    return response.data;
  },
};
