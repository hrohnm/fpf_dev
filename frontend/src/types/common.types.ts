export type ID = string | number;

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
}

export interface SelectOption {
  value: string | number;
  label: string;
}

export enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
}

export interface SortParams {
  field: string;
  direction: SortDirection;
}

export interface FilterParams {
  [key: string]: any;
}

export interface QueryParams extends PaginationParams {
  sort?: SortParams;
  filters?: FilterParams;
  search?: string;
}
