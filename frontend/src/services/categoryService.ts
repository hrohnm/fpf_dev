import api from '../utils/api';

export enum CategoryUnitType {
  PLACES = 'places',
  HOURS = 'hours'
}

export interface Category {
  id: string;
  name: string;
  description: string;
  code: string;
  unitType: CategoryUnitType;
  parentId: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryListResponse {
  data: Category[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CategoryFilters {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  parentId?: string | null;
  unitType?: CategoryUnitType;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Alle Kategorien mit Paginierung und Filterung abrufen
 */
export const getCategories = async (filters: CategoryFilters = {}): Promise<CategoryListResponse> => {
  // Konvertiere Filter in Query-String
  const queryParams = new URLSearchParams();
  
  if (filters.page) queryParams.append('page', filters.page.toString());
  if (filters.limit) queryParams.append('limit', filters.limit.toString());
  if (filters.search) queryParams.append('search', filters.search);
  if (filters.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());
  if (filters.parentId !== undefined) queryParams.append('parentId', filters.parentId === null ? 'null' : filters.parentId);
  if (filters.unitType) queryParams.append('unitType', filters.unitType);
  if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
  if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
  
  const queryString = queryParams.toString();
  const endpoint = `/admin/categories${queryString ? `?${queryString}` : ''}`;
  
  return api.get<CategoryListResponse>(endpoint);
};

/**
 * Alle Kategorien ohne Paginierung abrufen (für Dropdowns)
 */
export const getAllCategories = async (): Promise<Category[]> => {
  return api.get<Category[]>('/admin/categories/all');
};

/**
 * Kategorie nach ID abrufen
 */
export const getCategoryById = async (id: string): Promise<Category> => {
  return api.get<Category>(`/admin/categories/${id}`);
};

/**
 * Neue Kategorie erstellen
 */
export const createCategory = async (categoryData: Partial<Category>): Promise<Category> => {
  return api.post<Category>('/admin/categories', categoryData);
};

/**
 * Kategorie aktualisieren
 */
export const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category> => {
  return api.put<Category>(`/admin/categories/${id}`, categoryData);
};

/**
 * Kategorie löschen
 */
export const deleteCategory = async (id: string): Promise<void> => {
  return api.delete(`/admin/categories/${id}`);
};

export default {
  getCategories,
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
