import { ID } from './common.types';

export interface OccupancyRate {
  categoryId: ID;
  categoryName: string;
  totalCapacity: number;
  occupiedPlaces: number;
  availablePlaces: number;
  occupancyPercentage: number;
}

export interface OccupancyTrend {
  date: string;
  occupancyPercentage: number;
}

export interface CategoryDistribution {
  categoryId: ID;
  categoryName: string;
  count: number;
  percentage: number;
}

export interface AgeGroupDistribution {
  ageGroup: string;
  count: number;
  percentage: number;
}

export interface GenderDistribution {
  gender: string;
  count: number;
  percentage: number;
}

export interface RegionalDistribution {
  region: string;
  count: number;
  percentage: number;
}

export interface StatisticsFilters {
  startDate?: string;
  endDate?: string;
  categoryIds?: ID[];
  regions?: string[];
}

export interface DashboardStats {
  totalFacilities: number;
  totalCarriers: number;
  totalAvailablePlaces: number;
  occupancyRate: number;
  recentUpdates: {
    facilityId: ID;
    facilityName: string;
    categoryId: ID;
    categoryName: string;
    availablePlaces: number;
    lastUpdated: string;
  }[];
}
