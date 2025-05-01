import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CarrierLayout from '../../components/layout/CarrierLayout';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Modal } from '../../components/ui/Modal';
import { Spinner } from '../../components/ui/Spinner';
import FacilityAccordion from '../../components/carrier/FacilityAccordion';
import PlaceForm from '../../components/carrier/PlaceForm';
import HourForm from '../../components/carrier/HourForm';
import QuickCreatePlacesModal from '../../components/carrier/QuickCreatePlacesModal';
import { facilityService } from '../../services/facilityService';
import { categoryService, Category } from '../../services/categoryService';
import { placeService, Place, BulkPlaceCreationParams } from '../../services/placeService';
import { hourService, Hour } from '../../services/hourService';
import { useNotification } from '../../hooks/useNotification';

interface FacilityWithResources {
  id: string;
  name: string;
  maxCapacity: number;
  places?: Place[];
  hours?: Hour[];
  isLoadingPlaces?: boolean;
  isLoadingHours?: boolean;
}

const AvailabilityManagementPage: React.FC = () => {
  const { t } = useTranslation(['translation', 'availability', 'place']);
  const { showSuccess, showError } = useNotification();

  // State for facilities
  const [facilities, setFacilities] = useState<FacilityWithResources[]>([]);
  const [isLoadingFacilities, setIsLoadingFacilities] = useState(true);
  const [loadingFacilityId, setLoadingFacilityId] = useState<string | null>(null);

  // State for categories
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // State for filters
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // State for modals
  const [isPlaceFormOpen, setIsPlaceFormOpen] = useState(false);
  const [isHourFormOpen, setIsHourFormOpen] = useState(false);
  const [isQuickCreateModalOpen, setIsQuickCreateModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [selectedHour, setSelectedHour] = useState<Hour | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<FacilityWithResources | null>(null);
  const [deleteType, setDeleteType] = useState<'place' | 'hour'>('place');

  // Load facilities
  useEffect(() => {
    const loadFacilities = async () => {
      setIsLoadingFacilities(true);
      try {
        const response = await facilityService.getFacilities();
        const facilitiesData = response.data.map(facility => ({
          id: facility.id,
          name: facility.name,
          maxCapacity: facility.maxCapacity,
        }));
        setFacilities(facilitiesData);
      } catch (error) {
        console.error('Error loading facilities:', error);
        showError(t('facility.errors.loadFailed'));
      } finally {
        setIsLoadingFacilities(false);
      }
    };

    loadFacilities();
  }, []);

  // Load places for the first facility when facilities are loaded
  useEffect(() => {
    if (!isLoadingFacilities && facilities.length > 0) {
      // Use a ref to track if we've already loaded places for the first facility
      // to prevent infinite loops
      const firstFacilityId = facilities[0].id;

      // Create a stable function reference that doesn't change on re-renders
      const loadInitialPlaces = () => {
        console.log('Loading initial places for facility:', firstFacilityId);
        loadPlacesForFacility(firstFacilityId);
      };

      // Only load once when facilities are first loaded
      loadInitialPlaces();
    }
  }, [isLoadingFacilities]); // Only depend on isLoadingFacilities, not facilities

  // Load categories
  useEffect(() => {
    const loadCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Error loading categories:', error);
        showError(t('category.errors.loadFailed'));
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // Handle accordion toggle
  const handleAccordionToggle = (facilityId: string, isOpen: boolean) => {
    if (isOpen) {
      loadPlacesForFacility(facilityId);
      // Temporarily disable loading hours to avoid 404 errors
      // loadHoursForFacility(facilityId);
    }
  };

  // Load places for a facility
  const loadPlacesForFacility = async (facilityId: string) => {
    const facilityIndex = facilities.findIndex(f => f.id === facilityId);
    if (facilityIndex === -1) return;

    // Update loading state
    setFacilities(prev => {
      const updated = [...prev];
      updated[facilityIndex] = {
        ...updated[facilityIndex],
        isLoadingPlaces: true,
      };
      return updated;
    });

    try {
      const filters = {
        categoryId: selectedCategoryId || undefined,
      };

      const response = await placeService.getPlacesByFacility(facilityId, 1, 100, filters);

      setFacilities(prev => {
        const updated = [...prev];
        updated[facilityIndex] = {
          ...updated[facilityIndex],
          places: response.data,
          isLoadingPlaces: false,
        };
        return updated;
      });
    } catch (error) {
      console.error(`Error loading places for facility ${facilityId}:`, error);
      showError(t('place.errors.loadFailed'));

      setFacilities(prev => {
        const updated = [...prev];
        updated[facilityIndex] = {
          ...updated[facilityIndex],
          isLoadingPlaces: false,
        };
        return updated;
      });
    }
  };

  // Load hours for a facility
  const loadHoursForFacility = async (facilityId: string) => {
    const facilityIndex = facilities.findIndex(f => f.id === facilityId);
    if (facilityIndex === -1) return;

    // Update loading state
    setFacilities(prev => {
      const updated = [...prev];
      updated[facilityIndex] = {
        ...updated[facilityIndex],
        isLoadingHours: true,
      };
      return updated;
    });

    try {
      const filters = {
        categoryId: selectedCategoryId || undefined,
      };

      const response = await hourService.getHoursByFacility(facilityId, 1, 100, filters);

      setFacilities(prev => {
        const updated = [...prev];
        updated[facilityIndex] = {
          ...updated[facilityIndex],
          hours: response.data,
          isLoadingHours: false,
        };
        return updated;
      });
    } catch (error) {
      console.error(`Error loading hours for facility ${facilityId}:`, error);
      showError(t('hour.errors.loadFailed'));

      setFacilities(prev => {
        const updated = [...prev];
        updated[facilityIndex] = {
          ...updated[facilityIndex],
          isLoadingHours: false,
        };
        return updated;
      });
    }
  };

  // Handle create place
  const handleCreatePlace = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return;

    setSelectedFacility(facility);
    setSelectedPlace(null);
    setIsPlaceFormOpen(true);
  };

  // Handle edit place
  const handleEditPlace = (place: Place) => {
    setSelectedPlace(place);
    setSelectedFacility(facilities.find(f => f.id === place.facilityId) || null);
    setIsPlaceFormOpen(true);
  };

  // Handle delete place click
  const handleDeletePlaceClick = (place: Place) => {
    setSelectedPlace(place);
    setDeleteType('place');
    setIsDeleteDialogOpen(true);
  };

  // Handle delete place confirm
  const handleDeleteConfirm = async () => {
    try {
      if (deleteType === 'place' && selectedPlace) {
        await placeService.deletePlace(selectedPlace.id);
        showSuccess(t('place.deleteSuccess'));

        // Refresh places for the facility
        if (selectedPlace.facilityId) {
          loadPlacesForFacility(selectedPlace.facilityId);
        }
      } else if (deleteType === 'hour' && selectedHour) {
        await hourService.deleteHour(selectedHour.id);
        showSuccess(t('hour.deleteSuccess'));

        // Refresh hours for the facility
        if (selectedHour.facilityId) {
          loadHoursForFacility(selectedHour.facilityId);
        }
      }
    } catch (error) {
      console.error('Error deleting resource:', error);
      showError(deleteType === 'place' ? t('place.deleteError') : t('hour.deleteError'));
    } finally {
      setIsDeleteDialogOpen(false);
      setSelectedPlace(null);
      setSelectedHour(null);
    }
  };

  // Handle place form submit
  const handlePlaceFormSubmit = async (placeData: Partial<Place>) => {
    try {
      if (selectedPlace) {
        // Update existing place
        await placeService.updatePlace(selectedPlace.id, placeData);
        showSuccess(t('place.updateSuccess'));
      } else {
        // Create new place
        await placeService.createPlace(placeData);
        showSuccess(t('place.createSuccess'));
      }

      // Refresh places for the facility
      if (placeData.facilityId) {
        loadPlacesForFacility(placeData.facilityId);
      }

      setIsPlaceFormOpen(false);
    } catch (error) {
      console.error('Error saving place:', error);
      showError(selectedPlace ? t('place.updateError') : t('place.createError'));
    }
  };

  // Handle toggle place occupation
  const handleTogglePlaceOccupation = async (place: Place) => {
    try {
      await placeService.togglePlaceOccupation(place.id);
      showSuccess(t('place.occupationToggleSuccess'));

      // Refresh places for the facility
      if (place.facilityId) {
        loadPlacesForFacility(place.facilityId);
      }
    } catch (error) {
      console.error('Error toggling place occupation:', error);
      showError(t('place.occupationToggleError'));
    }
  };

  // Handle change place gender suitability
  const handleChangePlaceGenderSuitability = async (place: Place, genderSuitability: 'male' | 'female' | 'all') => {
    try {
      await placeService.updatePlaceGenderSuitability(place.id, genderSuitability);
      showSuccess(t('place.genderUpdateSuccess'));

      // Refresh places for the facility
      if (place.facilityId) {
        loadPlacesForFacility(place.facilityId);
      }
    } catch (error) {
      console.error('Error updating place gender suitability:', error);
      showError(t('place.genderUpdateError'));
    }
  };

  // Handle create hour
  const handleCreateHour = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return;

    setSelectedFacility(facility);
    setSelectedHour(null);
    setIsHourFormOpen(true);
  };

  // Handle edit hour
  const handleEditHour = (hour: Hour) => {
    setSelectedHour(hour);
    setSelectedFacility(facilities.find(f => f.id === hour.facilityId) || null);
    setIsHourFormOpen(true);
  };

  // Handle delete hour click
  const handleDeleteHourClick = (hour: Hour) => {
    setSelectedHour(hour);
    setDeleteType('hour');
    setIsDeleteDialogOpen(true);
  };

  // Handle hour form submit
  const handleHourFormSubmit = async (hourData: Partial<Hour>) => {
    try {
      if (selectedHour) {
        // Update existing hour
        await hourService.updateHour(selectedHour.id, hourData);
        showSuccess(t('hour.updateSuccess'));
      } else {
        // Create new hour
        await hourService.createHour(hourData);
        showSuccess(t('hour.createSuccess'));
      }

      // Refresh hours for the facility
      if (hourData.facilityId) {
        loadHoursForFacility(hourData.facilityId);
      }

      setIsHourFormOpen(false);
    } catch (error) {
      console.error('Error saving hour:', error);
      showError(selectedHour ? t('hour.updateError') : t('hour.createError'));
    }
  };

  // Handle update available hours
  const handleUpdateAvailableHours = async (hour: Hour, availableHours: number) => {
    try {
      await hourService.updateAvailableHours(hour.id, availableHours);
      showSuccess(t('hour.availableHoursUpdateSuccess'));

      // Refresh hours for the facility
      if (hour.facilityId) {
        loadHoursForFacility(hour.facilityId);
      }
    } catch (error) {
      console.error('Error updating available hours:', error);
      showError(t('hour.availableHoursUpdateError'));
    }
  };

  // Handle change hour gender suitability
  const handleChangeHourGenderSuitability = async (hour: Hour, genderSuitability: 'male' | 'female' | 'all') => {
    try {
      await hourService.updateHour(hour.id, { genderSuitability });
      showSuccess(t('hour.genderUpdateSuccess'));

      // Refresh hours for the facility
      if (hour.facilityId) {
        loadHoursForFacility(hour.facilityId);
      }
    } catch (error) {
      console.error('Error updating hour gender suitability:', error);
      showError(t('hour.genderUpdateError'));
    }
  };

  // Handle quick create places
  const handleQuickCreatePlaces = (facilityId: string) => {
    const facility = facilities.find(f => f.id === facilityId);
    if (!facility) return;

    setSelectedFacility(facility);
    setIsQuickCreateModalOpen(true);
  };

  // Handle quick create places submit
  const handleQuickCreatePlacesSubmit = async (params: BulkPlaceCreationParams) => {
    if (!selectedFacility) return;

    try {
      await placeService.bulkCreatePlaces(selectedFacility.id, params);
      showSuccess(t('place.bulkCreateSuccess', { count: params.count }));

      // Refresh places for the facility
      loadPlacesForFacility(selectedFacility.id);

      setIsQuickCreateModalOpen(false);
    } catch (error) {
      console.error('Error bulk creating places:', error);
      showError(t('place.bulkCreateError'));
    }
  };

  // Handle category filter change
  const handleCategoryFilterChange = (value: string) => {
    setSelectedCategoryId(value);

    // Reload resources for all open facilities
    facilities.forEach(facility => {
      if (facility.places) {
        loadPlacesForFacility(facility.id);
        // Temporarily disable loading hours to avoid 404 errors
        // loadHoursForFacility(facility.id);
      }
    });
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter facilities by name
    // This is a client-side filter since we already have all facilities loaded
  };

  // Filtered facilities based on search query
  const filteredFacilities = facilities.filter(facility =>
    !searchQuery || facility.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <CarrierLayout
      title={t('availability:management')}
      breadcrumbs={[
        { label: t('dashboard.title'), path: '/carrier' },
        { label: t('availability:management'), path: '/carrier/availabilities' },
      ]}
    >
      {/* Filters */}
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <form onSubmit={handleSearch} className="w-full md:w-1/2">
              <Input
                type="text"
                placeholder={t('common.searchFacilities')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </form>
            <div className="w-full md:w-1/2">
              <Select
                value={selectedCategoryId}
                onChange={handleCategoryFilterChange}
                className="w-full"
              >
                <option value="">{t('common.all')}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Facilities accordion */}
      {isLoadingFacilities ? (
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      ) : filteredFacilities.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">
            {searchQuery
              ? t('facility.noSearchResults')
              : t('facility.noFacilities')}
          </p>
        </Card>
      ) : (
        <FacilityAccordion
          facilities={filteredFacilities}
          onAccordionToggle={handleAccordionToggle}
          onCreatePlace={handleCreatePlace}
          onCreateHour={handleCreateHour}
          onEditPlace={handleEditPlace}
          onDeletePlace={handleDeletePlaceClick}
          onTogglePlaceOccupation={handleTogglePlaceOccupation}
          onChangePlaceGenderSuitability={handleChangePlaceGenderSuitability}
          onEditHour={handleEditHour}
          onDeleteHour={handleDeleteHourClick}
          onUpdateAvailableHours={handleUpdateAvailableHours}
          onChangeHourGenderSuitability={handleChangeHourGenderSuitability}
          onQuickCreatePlaces={handleQuickCreatePlaces}
        />
      )}

      {/* Place Form Modal */}
      <Modal
        isOpen={isPlaceFormOpen}
        onClose={() => setIsPlaceFormOpen(false)}
        title={selectedPlace ? t('place:editPlace') : t('place:addPlace')}
      >
        <PlaceForm
          place={selectedPlace || undefined}
          categories={categories.filter(c => c.unitType === 'places')}
          facilityId={selectedPlace?.facilityId || selectedFacility?.id || ''}
          maxCapacity={selectedFacility?.maxCapacity || 0}
          currentPlacesCount={selectedFacility?.places?.length || 0}
          onSubmit={handlePlaceFormSubmit}
          onCancel={() => setIsPlaceFormOpen(false)}
        />
      </Modal>

      {/* Hour Form Modal */}
      <Modal
        isOpen={isHourFormOpen}
        onClose={() => setIsHourFormOpen(false)}
        title={selectedHour ? t('hour.editHour') : t('hour.addHour')}
      >
        <HourForm
          hour={selectedHour || undefined}
          categories={categories}
          facilityId={selectedHour?.facilityId || selectedFacility?.id || ''}
          onSubmit={handleHourFormSubmit}
          onCancel={() => setIsHourFormOpen(false)}
        />
      </Modal>

      {/* Quick Create Places Modal */}
      {selectedFacility && (
        <QuickCreatePlacesModal
          isOpen={isQuickCreateModalOpen}
          onClose={() => setIsQuickCreateModalOpen(false)}
          onSubmit={handleQuickCreatePlacesSubmit}
          categories={categories.filter(c => c.unitType === 'places')}
          facilityName={selectedFacility.name}
          maxCapacity={selectedFacility.maxCapacity}
          currentPlacesCount={selectedFacility.places?.length || 0}
        />
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={deleteType === 'place' ? t('place.deleteTitle') : t('hour.deleteTitle')}
        message={
          deleteType === 'place'
            ? t('place.deleteMessage', { name: selectedPlace?.name || '' })
            : t('hour.deleteMessage', { name: selectedHour?.name || '' })
        }
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
      />
    </CarrierLayout>
  );
};

export default AvailabilityManagementPage;
