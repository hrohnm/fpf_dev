import { ID } from './common.types';
import { User } from './auth.types';

export interface Carrier {
  id: ID;
  name: string;
  description?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isPremium: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  users?: User[];
}

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
  carrier?: Carrier;
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

export enum GenderSuitability {
  MALE = 'male',
  FEMALE = 'female',
  ALL = 'all',
}

export interface Availability {
  id: ID;
  facilityId: ID;
  categoryId: ID;
  availablePlaces: number;
  genderSuitability: GenderSuitability;
  minAge: number;
  maxAge: number;
  notes?: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  facility?: Facility;
  category?: Category;
}

export interface Category {
  id: ID;
  name: string;
  description?: string;
  parentId?: ID;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  children?: Category[];
  parent?: Category;
}

export interface CreateCarrierRequest {
  name: string;
  description?: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  isPremium?: boolean;
  userIds?: ID[];
}

export interface UpdateCarrierRequest {
  name?: string;
  description?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  isPremium?: boolean;
  isActive?: boolean;
  userIds?: ID[];
}

export interface CreateFacilityRequest {
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
}

export interface UpdateFacilityRequest {
  name?: string;
  description?: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  openingHours?: string;
  maxCapacity?: number;
  isActive?: boolean;
}

export interface CreateAvailabilityRequest {
  facilityId: ID;
  categoryId: ID;
  availablePlaces: number;
  genderSuitability: GenderSuitability;
  minAge: number;
  maxAge: number;
  notes?: string;
}

export interface UpdateAvailabilityRequest {
  availablePlaces?: number;
  genderSuitability?: GenderSuitability;
  minAge?: number;
  maxAge?: number;
  notes?: string;
}
