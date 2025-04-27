import api from '../utils/api';

export interface Carrier {
  id: string;
  name: string;
  description: string;
  contactPerson: string;
  email: string;
  phone: string;
  website: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  facilities?: Facility[];
}

export interface Facility {
  id: string;
  name: string;
  carrierId: string;
  // Weitere Eigenschaften können bei Bedarf hinzugefügt werden
}

export interface CarrierListResponse {
  data: Carrier[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CarrierFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Alle Träger mit Paginierung und Filterung abrufen
 */
export const getCarriers = async (filters: CarrierFilters = {}): Promise<CarrierListResponse> => {
  // Konvertiere Filter in Query-String
  const queryParams = new URLSearchParams();

  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
  if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

  const queryString = queryParams.toString();
  const endpoint = `/admin/carriers${queryString ? `?${queryString}` : ''}`;

  return api.get<CarrierListResponse>(endpoint);
};

/**
 * Träger nach ID abrufen
 */
export const getCarrierById = async (id: string): Promise<Carrier> => {
  return api.get<Carrier>(`/admin/carriers/${id}`);
};

/**
 * Neuen Träger erstellen
 */
export const createCarrier = async (carrierData: Partial<Carrier>): Promise<Carrier> => {
  return api.post<Carrier>('/admin/carriers', carrierData);
};

/**
 * Träger aktualisieren
 */
export const updateCarrier = async (id: string, carrierData: Partial<Carrier>): Promise<Carrier> => {
  return api.put<Carrier>(`/admin/carriers/${id}`, carrierData);
};

/**
 * Träger löschen
 */
export const deleteCarrier = async (id: string): Promise<void> => {
  return api.delete(`/admin/carriers/${id}`);
};

/**
 * Get all carriers without pagination (for dropdowns)
 */
export const getAllCarriers = async (): Promise<Carrier[]> => {
  const response = await api.get<Carrier[]>('/admin/carriers/all');
  return response;
};

export default {
  getCarriers,
  getCarrierById,
  createCarrier,
  updateCarrier,
  deleteCarrier,
  getAllCarriers,
};
