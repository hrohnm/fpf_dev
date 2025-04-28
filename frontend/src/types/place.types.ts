export interface Place {
  id: string;
  facilityId: string;
  categoryId: string;
  name: string;
  isOccupied: boolean;
  genderSuitability: 'male' | 'female' | 'all';
  minAge: number;
  maxAge: number;
  notes?: string;
  lastUpdated: string;
  createdAt: string;
  updatedAt: string;
  facility?: {
    id: string;
    name: string;
    carrierId: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

export interface PlaceFilter {
  categoryId?: string;
  isOccupied?: boolean;
  genderSuitability?: 'male' | 'female' | 'all';
}

export interface PlaceStatistics {
  totalPlaces: number;
  occupiedPlaces: number;
  availablePlaces: number;
  occupancyRate: number;
  genderDistribution: {
    male: number;
    female: number;
    all: number;
  };
  placesByCategory: Array<{
    categoryId: string;
    category: {
      name: string;
    };
    count: number;
  }>;
}
