import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { placeService } from '../../services/placeService';
import { facilityService } from '../../services/facilityService';
import { categoryService } from '../../services/categoryService';
import { Place } from '../../types/place.types';
import { Category } from '../../types/carrier.types';
import CarrierLayout from '../../components/layout/CarrierLayout';
import PlaceList from '../../components/carrier/PlaceList';
import PlaceForm from '../../components/carrier/PlaceForm';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Card } from '../../components/ui/Card';
import { Modal } from '../../components/ui/Modal';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { Pagination } from '../../components/ui/Pagination';
import { Spinner } from '../../components/ui/Spinner';

const PlaceManagementPage: React.FC = () => {
  const { facilityId } = useParams<{ facilityId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // State
  const [places, setPlaces] = useState<Place[]>([]);
  const [facility, setFacility] = useState<any>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPlaces, setTotalPlaces] = useState(0);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [filters, setFilters] = useState({
    categoryId: '',
    isOccupied: undefined as boolean | undefined,
    genderSuitability: '' as '' | 'male' | 'female' | 'all',
    search: '',
  });

  // Load facility, categories, and places
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load facility
        if (facilityId) {
          const facilityData = await facilityService.getFacilityById(facilityId);
          setFacility(facilityData);
        }
        
        // Load categories
        const categoriesData = await categoryService.getAllCategories();
        setCategories(categoriesData);
        
        // Load places
        await loadPlaces();
      } catch (err: any) {
        setError(err.message || 'Failed to load data');
        toast.error(t('place.errors.loadFailed'));
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [facilityId]);

  // Load places with filters
  const loadPlaces = async (page = currentPage) => {
    try {
      if (!facilityId) return;
      
      const response = await placeService.getPlacesByFacility(
        facilityId,
        page,
        10,
        {
          categoryId: filters.categoryId || undefined,
          isOccupied: filters.isOccupied,
          genderSuitability: filters.genderSuitability || undefined,
        }
      );
      
      setPlaces(response.data);
      setCurrentPage(response.meta.page);
      setTotalPages(response.meta.totalPages);
      setTotalPlaces(response.meta.total);
    } catch (err: any) {
      setError(err.message || 'Failed to load places');
      toast.error(t('place.errors.loadFailed'));
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    loadPlaces(page);
  };

  // Handle filter change
  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let parsedValue: string | boolean | undefined = value;
    if (name === 'isOccupied') {
      parsedValue = value === '' ? undefined : value === 'true';
    }
    
    setFilters((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1);
    loadPlaces(1);
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      categoryId: '',
      isOccupied: undefined,
      genderSuitability: '',
      search: '',
    });
    setCurrentPage(1);
    loadPlaces(1);
  };

  // Open form to create a new place
  const handleCreatePlace = () => {
    setSelectedPlace(null);
    setIsFormOpen(true);
  };

  // Open form to edit a place
  const handleEditPlace = (place: Place) => {
    setSelectedPlace(place);
    setIsFormOpen(true);
  };

  // Open delete confirmation dialog
  const handleDeleteClick = (place: Place) => {
    setSelectedPlace(place);
    setIsDeleteDialogOpen(true);
  };

  // Handle form submission (create or update)
  const handleFormSubmit = async (placeData: Partial<Place>) => {
    try {
      if (selectedPlace?.id) {
        // Update existing place
        await placeService.updatePlace(selectedPlace.id, placeData);
        toast.success(t('place.updateSuccess'));
      } else {
        // Create new place
        await placeService.createPlace({
          ...placeData,
          facilityId: facilityId!,
        });
        toast.success(t('place.createSuccess'));
      }
      
      setIsFormOpen(false);
      loadPlaces();
    } catch (err: any) {
      toast.error(err.message || t('place.errors.saveFailed'));
    }
  };

  // Handle place deletion
  const handleDeleteConfirm = async () => {
    try {
      if (selectedPlace?.id) {
        await placeService.deletePlace(selectedPlace.id);
        toast.success(t('place.deleteSuccess'));
        setIsDeleteDialogOpen(false);
        loadPlaces();
      }
    } catch (err: any) {
      toast.error(err.message || t('place.errors.deleteFailed'));
    }
  };

  // Toggle place occupation status
  const handleToggleOccupation = async (place: Place) => {
    try {
      await placeService.togglePlaceOccupation(place.id);
      toast.success(place.isOccupied ? t('place.markedAvailable') : t('place.markedOccupied'));
      loadPlaces();
    } catch (err: any) {
      toast.error(err.message || t('place.errors.updateFailed'));
    }
  };

  // Change place gender suitability
  const handleChangeGenderSuitability = async (place: Place, genderSuitability: 'male' | 'female' | 'all') => {
    try {
      await placeService.updatePlaceGenderSuitability(place.id, genderSuitability);
      toast.success(t('place.genderSuitabilityUpdated'));
      loadPlaces();
    } catch (err: any) {
      toast.error(err.message || t('place.errors.updateFailed'));
    }
  };

  if (loading && !places.length) {
    return (
      <CarrierLayout
        title={t('place.management')}
        breadcrumbs={[
          { label: t('dashboard.title'), path: '/carrier' },
          { label: t('facility.management'), path: '/carrier/facilities' },
          { label: facility?.name || '', path: `/carrier/facilities/${facilityId}` },
          { label: t('place.management'), path: `/carrier/facilities/${facilityId}/places` },
        ]}
      >
        <div className="flex justify-center items-center h-64">
          <Spinner size="lg" />
        </div>
      </CarrierLayout>
    );
  }

  if (error && !places.length) {
    return (
      <CarrierLayout
        title={t('place.management')}
        breadcrumbs={[
          { label: t('dashboard.title'), path: '/carrier' },
          { label: t('facility.management'), path: '/carrier/facilities' },
          { label: facility?.name || '', path: `/carrier/facilities/${facilityId}` },
          { label: t('place.management'), path: `/carrier/facilities/${facilityId}/places` },
        ]}
      >
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {error}
              </p>
              <div className="mt-2">
                <Button
                  size="sm"
                  onClick={() => loadPlaces()}
                >
                  {t('common.retry')}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CarrierLayout>
    );
  }

  return (
    <CarrierLayout
      title={`${t('place.management')} - ${facility?.name || ''}`}
      breadcrumbs={[
        { label: t('dashboard.title'), path: '/carrier' },
        { label: t('facility.management'), path: '/carrier/facilities' },
        { label: facility?.name || '', path: `/carrier/facilities/${facilityId}` },
        { label: t('place.management'), path: `/carrier/facilities/${facilityId}/places` },
      ]}
    >
      <Card>
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {t('place.list')}
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {t('place.listDescription', { facility: facility?.name })}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {t('place.capacityInfo', {
                  current: totalPlaces,
                  max: facility?.maxCapacity || 0,
                })}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                onClick={handleCreatePlace}
                disabled={facility && totalPlaces >= facility.maxCapacity}
              >
                {t('place.addPlace')}
              </Button>
            </div>
          </div>

          <div className="bg-gray-50 p-4 rounded-md mb-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                  {t('place.category')}
                </label>
                <Select
                  id="categoryId"
                  name="categoryId"
                  value={filters.categoryId}
                  onChange={handleFilterChange}
                >
                  <option value="">{t('common.all')}</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div>
                <label htmlFor="isOccupied" className="block text-sm font-medium text-gray-700">
                  {t('place.status')}
                </label>
                <Select
                  id="isOccupied"
                  name="isOccupied"
                  value={filters.isOccupied === undefined ? '' : String(filters.isOccupied)}
                  onChange={handleFilterChange}
                >
                  <option value="">{t('common.all')}</option>
                  <option value="false">{t('place.available')}</option>
                  <option value="true">{t('place.occupied')}</option>
                </Select>
              </div>
              <div>
                <label htmlFor="genderSuitability" className="block text-sm font-medium text-gray-700">
                  {t('place.genderSuitability.label')}
                </label>
                <Select
                  id="genderSuitability"
                  name="genderSuitability"
                  value={filters.genderSuitability}
                  onChange={handleFilterChange}
                >
                  <option value="">{t('common.all')}</option>
                  <option value="male">{t('place.genderSuitability.male')}</option>
                  <option value="female">{t('place.genderSuitability.female')}</option>
                  <option value="all">{t('place.genderSuitability.all')}</option>
                </Select>
              </div>
              <div className="flex items-end space-x-2">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                >
                  {t('common.reset')}
                </Button>
                <Button
                  onClick={applyFilters}
                >
                  {t('common.apply')}
                </Button>
              </div>
            </div>
          </div>

          {places.length === 0 ? (
            <div className="bg-white p-6 text-center border rounded-md">
              <p className="text-gray-500">
                {t('place.noPlaces')}
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={handleCreatePlace}
                disabled={facility && totalPlaces >= facility.maxCapacity}
              >
                {t('place.addPlace')}
              </Button>
            </div>
          ) : (
            <>
              <PlaceList
                places={places}
                onEdit={handleEditPlace}
                onDelete={handleDeleteClick}
                onToggleOccupation={handleToggleOccupation}
                onChangeGenderSuitability={handleChangeGenderSuitability}
              />
              
              <div className="mt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Place Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedPlace ? t('place.editPlace') : t('place.addPlace')}
      >
        <PlaceForm
          place={selectedPlace || undefined}
          categories={categories}
          facilityId={facilityId!}
          maxCapacity={facility?.maxCapacity || 0}
          currentPlacesCount={totalPlaces}
          onSubmit={handleFormSubmit}
          onCancel={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteConfirm}
        title={t('place.deleteTitle')}
        message={t('place.deleteMessage', { name: selectedPlace?.name || '' })}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
      />
    </CarrierLayout>
  );
};

export default PlaceManagementPage;
