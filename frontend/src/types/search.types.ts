import { ID } from './common.types';
import { GenderSuitability } from './carrier.types';

export interface SearchFilters {
  categoryIds?: ID[];
  genderSuitability?: GenderSuitability;
  minAge?: number;
  maxAge?: number;
  city?: string;
  postalCode?: string;
  radius?: number;
  latitude?: number;
  longitude?: number;
}

export interface SavedFilter {
  id: ID;
  userId: ID;
  name: string;
  filters: SearchFilters;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: ID;
  userId: ID;
  facilityId: ID;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSavedFilterRequest {
  name: string;
  filters: SearchFilters;
}

export interface UpdateSavedFilterRequest {
  name?: string;
  filters?: SearchFilters;
}

export interface CreateFavoriteRequest {
  facilityId: ID;
  notes?: string;
}

export interface UpdateFavoriteRequest {
  notes?: string;
}
