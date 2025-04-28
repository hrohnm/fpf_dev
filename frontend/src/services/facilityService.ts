import api from '../utils/api';
import { ID } from '../types/common.types';

export interface Facility {
  id: ID;
  carrierId: ID;
  name: string;
  description?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  maxCapacity: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  carrier?: {
    id: ID;
    name: string;
  };
  images?: FacilityImage[];
  availabilities?: Availability[];
}

export interface FacilityImage {
  id: ID;
  facilityId: ID;
  url: string;
  caption?: string;
  isMain: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Availability {
  id: ID;
  facilityId: ID;
  categoryId: ID;
  availablePlaces: number;
  totalPlaces?: number;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: ID;
    name: string;
  };
}

export interface FacilityListResponse {
  data: Facility[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FacilityFilters {
  page?: number;
  limit?: number;
  search?: string;
  carrierId?: string;
  city?: string;
  postalCode?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Alle Einrichtungen mit Paginierung und Filterung abrufen
 */
export const getFacilities = async (filters: FacilityFilters = {}): Promise<FacilityListResponse> => {
  // Konvertiere Filter in Query-String
  const queryParams = new URLSearchParams();

  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.carrierId) queryParams.append('carrierId', filters.carrierId);
  if (filters.city) queryParams.append('city', filters.city);
  if (filters.postalCode) queryParams.append('postalCode', filters.postalCode);
  if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
  if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

  const queryString = queryParams.toString();
  const endpoint = `/carrier/facilities${queryString ? `?${queryString}` : ''}`;

  return api.get<FacilityListResponse>(endpoint);
};

/**
 * Einrichtung nach ID abrufen
 */
export const getFacilityById = async (id: string): Promise<Facility> => {
  return api.get<Facility>(`/carrier/facilities/${id}`);
};

/**
 * Neue Einrichtung erstellen
 */
export const createFacility = async (facilityData: Partial<Facility>): Promise<Facility> => {
  return api.post<Facility>('/carrier/facilities', facilityData);
};

/**
 * Einrichtung aktualisieren
 */
export const updateFacility = async (id: string, facilityData: Partial<Facility>): Promise<Facility> => {
  return api.put<Facility>(`/carrier/facilities/${id}`, facilityData);
};

/**
 * Einrichtung löschen
 */
export const deleteFacility = async (id: string): Promise<void> => {
  return api.delete(`/carrier/facilities/${id}`);
};

export const facilityService = {
  getFacilities,
  getFacilityById,
  createFacility,
  updateFacility,
  deleteFacility,
};

export default facilityService;
