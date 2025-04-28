import api from '../utils/api';
import { ID } from '../types/common.types';
import { GenderSuitability } from '../types/carrier.types';

export interface Availability {
  id: ID;
  facilityId: ID;
  categoryId: ID;
  availablePlaces: number;
  totalPlaces: number;
  genderSuitability: GenderSuitability;
  minAge: number;
  maxAge: number;
  notes?: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  facility?: {
    id: ID;
    name: string;
    carrierId: ID;
  };
  category?: {
    id: ID;
    name: string;
  };
}

export interface AvailabilityListResponse {
  data: Availability[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AvailabilityFilters {
  page?: number;
  limit?: number;
  facilityId?: string;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface BulkUpdateItem {
  id: ID;
  availablePlaces: number;
}

export interface BulkUpdateResponse {
  message: string;
  updatedCount: number;
}

/**
 * Alle Verfügbarkeiten mit Paginierung und Filterung abrufen
 */
export const getAvailabilities = async (filters: AvailabilityFilters = {}): Promise<AvailabilityListResponse> => {
  // Konvertiere Filter in Query-String
  const queryParams = new URLSearchParams();

  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.facilityId) queryParams.append('facilityId', filters.facilityId);
  if (filters.categoryId) queryParams.append('categoryId', filters.categoryId);
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
  if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

  const queryString = queryParams.toString();
  const endpoint = `/carrier/availability${queryString ? `?${queryString}` : ''}`;

  return api.get<AvailabilityListResponse>(endpoint);
};

/**
 * Verfügbarkeit nach ID abrufen
 */
export const getAvailabilityById = async (id: string): Promise<Availability> => {
  return api.get<Availability>(`/carrier/availability/${id}`);
};

/**
 * Neue Verfügbarkeit erstellen
 */
export const createAvailability = async (availabilityData: Partial<Availability>): Promise<Availability> => {
  return api.post<Availability>('/carrier/availability', availabilityData);
};

/**
 * Verfügbarkeit aktualisieren
 */
export const updateAvailability = async (id: string, availabilityData: Partial<Availability>): Promise<Availability> => {
  return api.put<Availability>(`/carrier/availability/${id}`, availabilityData);
};

/**
 * Verfügbarkeit löschen
 */
export const deleteAvailability = async (id: string): Promise<void> => {
  return api.delete(`/carrier/availability/${id}`);
};

/**
 * Mehrere Verfügbarkeiten gleichzeitig aktualisieren
 */
export const bulkUpdateAvailabilities = async (availabilities: BulkUpdateItem[]): Promise<BulkUpdateResponse> => {
  return api.put<BulkUpdateResponse>('/carrier/availability/bulk/update', { availabilities });
};

export const availabilityService = {
  getAvailabilities,
  getAvailabilityById,
  createAvailability,
  updateAvailability,
  deleteAvailability,
  bulkUpdateAvailabilities,
};

export default availabilityService;
