import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CarrierLayout from '../../components/layout/CarrierLayout';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Select from '../../components/ui/Select';
import Input from '../../components/ui/Input';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Availability, getAvailabilities, deleteAvailability, bulkUpdateAvailabilities, AvailabilityFilters, BulkUpdateItem } from '../../services/availabilityService';
import { Facility, getFacilities } from '../../services/facilityService';
import { Category, getAllCategories } from '../../services/categoryService';
import { useNotification } from '../../hooks/useNotification';
import { GenderSuitability } from '../../types/carrier.types';

const AvailabilityPage: React.FC = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();

  // State
  const [availabilities, setAvailabilities] = useState<Availability[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedFacilityId, setSelectedFacilityId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalAvailabilities, setTotalAvailabilities] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [availabilityToDelete, setAvailabilityToDelete] = useState<Availability | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [editedAvailabilities, setEditedAvailabilities] = useState<Record<string, number>>({});
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Fetch facilities and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [facilitiesResponse, categoriesResponse] = await Promise.all([
          getFacilities({ limit: 100 }),
          getAllCategories(),
        ]);

        setFacilities(facilitiesResponse.data);
        setCategories(categoriesResponse);
      } catch (error) {
        console.error('Error fetching data:', error);
        showError(t('carrier.availabilities.fetchError', 'Fehler beim Laden der Daten'));
      }
    };

    fetchData();
  }, []);

  // Fetch availabilities
  const fetchAvailabilities = async () => {
    setIsLoading(true);

    try {
      const filters: AvailabilityFilters = {
        page: currentPage,
        limit: pageSize,
        facilityId: selectedFacilityId || undefined,
        categoryId: selectedCategoryId || undefined,
        sortBy: 'lastUpdated',
        sortOrder: 'desc',
      };

      const response = await getAvailabilities(filters);
      setAvailabilities(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalAvailabilities(response.meta.total);

      // Reset edited availabilities
      setEditedAvailabilities({});
      setHasChanges(false);
    } catch (error) {
      console.error('Error fetching availabilities:', error);
      showError(t('carrier.availabilities.fetchError', 'Fehler beim Laden der Verfügbarkeiten'));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchAvailabilities();
  }, [currentPage, selectedFacilityId, selectedCategoryId]);

  // Handle facility change
  const handleFacilityChange = (value: string) => {
    setSelectedFacilityId(value);
    setCurrentPage(1);
  };

  // Handle category change
  const handleCategoryChange = (value: string) => {
    setSelectedCategoryId(value);
    setCurrentPage(1);
  };

  // Handle availability change
  const handleAvailabilityChange = (id: string, value: number) => {
    setEditedAvailabilities(prev => ({
      ...prev,
      [id]: value
    }));
    setHasChanges(true);
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    if (!hasChanges) return;

    setIsSaving(true);

    try {
      const updates: BulkUpdateItem[] = Object.entries(editedAvailabilities).map(([id, availablePlaces]) => ({
        id,
        availablePlaces
      }));

      await bulkUpdateAvailabilities(updates);
      showSuccess(t('carrier.availabilities.updateSuccess', 'Verfügbarkeiten erfolgreich aktualisiert'));
      fetchAvailabilities();
    } catch (error) {
      console.error('Error updating availabilities:', error);
      showError(t('carrier.availabilities.updateError', 'Fehler beim Aktualisieren der Verfügbarkeiten'));
    } finally {
      setIsSaving(false);
    }
  };

  // Handle delete click
  const handleDeleteClick = (availability: Availability) => {
    setAvailabilityToDelete(availability);
    setShowDeleteConfirm(true);
  };

  // Handle delete confirm
  const handleDeleteConfirm = async () => {
    if (!availabilityToDelete) return;

    setIsDeleting(true);

    try {
      await deleteAvailability(availabilityToDelete.id.toString());
      showSuccess(t('carrier.availabilities.deleteSuccess', 'Verfügbarkeit erfolgreich gelöscht'));
      setShowDeleteConfirm(false);
      fetchAvailabilities();
    } catch (error) {
      console.error('Error deleting availability:', error);
      showError(t('carrier.availabilities.deleteError', 'Fehler beim Löschen der Verfügbarkeit'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Get gender suitability label
  const getGenderSuitabilityLabel = (genderSuitability: GenderSuitability) => {
    switch (genderSuitability) {
      case GenderSuitability.MALE:
        return t('availability.genderSuitability.male', 'Männlich');
      case GenderSuitability.FEMALE:
        return t('availability.genderSuitability.female', 'Weiblich');
      case GenderSuitability.ALL:
        return t('availability.genderSuitability.all', 'Alle');
      default:
        return '';
    }
  };

  // Get availability value
  const getAvailabilityValue = (availability: Availability) => {
    return editedAvailabilities[availability.id] !== undefined
      ? editedAvailabilities[availability.id]
      : availability.availablePlaces;
  };

  return (
    <CarrierLayout
      title={t('carrier.availabilities.title', 'Verfügbarkeiten')}
      breadcrumbs={[
        { label: t('carrier.dashboard.title', 'Träger Dashboard'), path: '/carrier' },
        { label: t('carrier.availabilities.title', 'Verfügbarkeiten'), path: '/carrier/availabilities' }
      ]}
    >
      {/* Filters */}
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="facility" className="block text-sm font-medium text-gray-700">
                {t('availability.facility', 'Einrichtung')}
              </label>
              <Select
                id="facility"
                value={selectedFacilityId}
                onChange={handleFacilityChange}
                className="mt-1"
              >
                <option value="">{t('common.all', 'Alle')}</option>
                {facilities.map(facility => (
                  <option key={facility.id} value={facility.id}>
                    {facility.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                {t('availability.category', 'Kategorie')}
              </label>
              <Select
                id="category"
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                className="mt-1"
              >
                <option value="">{t('common.all', 'Alle')}</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Save changes button */}
      {hasChanges && (
        <div className="mb-4 flex justify-end">
          <Button
            variant="primary"
            onClick={handleSaveChanges}
            isLoading={isSaving}
            disabled={isSaving}
          >
            {t('common.saveChanges', 'Änderungen speichern')}
          </Button>
        </div>
      )}

      {/* Availabilities list */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : availabilities.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">
            {selectedFacilityId || selectedCategoryId
              ? t('carrier.availabilities.noFilterResults', 'Keine Verfügbarkeiten gefunden, die Ihren Filterkriterien entsprechen.')
              : t('carrier.availabilities.noAvailabilities', 'Sie haben noch keine Verfügbarkeiten. Erstellen Sie Verfügbarkeiten für Ihre Einrichtungen.')}
          </p>
        </Card>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('availability.facility', 'Einrichtung')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('availability.category', 'Kategorie')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('availability.genderAndAge', 'Geschlecht & Alter')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('availability.availablePlaces', 'Verfügbare Plätze')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('availability.totalPlaces', 'Gesamtplätze')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('availability.lastUpdated', 'Letzte Aktualisierung')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions', 'Aktionen')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {availabilities.map((availability) => (
                  <tr key={availability.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {availability.facility?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {availability.category?.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getGenderSuitabilityLabel(availability.genderSuitability)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {availability.minAge} - {availability.maxAge} {t('availability.years', 'Jahre')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Input
                        type="number"
                        min="0"
                        max={availability.totalPlaces}
                        value={getAvailabilityValue(availability)}
                        onChange={(e) => handleAvailabilityChange(availability.id.toString(), parseInt(e.target.value, 10))}
                        className="w-20"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {availability.totalPlaces}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(availability.lastUpdated).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(availability)}
                        className="text-red-600 hover:text-red-900"
                      >
                        {t('common.delete', 'Löschen')}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              {t('common.previous', 'Zurück')}
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              {t('common.next', 'Weiter')}
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {t('common.showing', 'Zeige')} <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> {t('common.to', 'bis')}{' '}
                <span className="font-medium">{Math.min(currentPage * pageSize, totalAvailabilities)}</span> {t('common.of', 'von')}{' '}
                <span className="font-medium">{totalAvailabilities}</span> {t('common.results', 'Ergebnissen')}
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <span className="sr-only">{t('common.previous', 'Zurück')}</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>

                {/* Page numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => {
                    // Show current page, first and last page, and pages around current page
                    return (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    );
                  })
                  .map((page, index, array) => {
                    // Add ellipsis if there are gaps
                    const showEllipsisBefore = index > 0 && array[index - 1] !== page - 1;
                    const showEllipsisAfter = index < array.length - 1 && array[index + 1] !== page + 1;

                    return (
                      <React.Fragment key={page}>
                        {showEllipsisBefore && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}

                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            page === currentPage
                              ? 'z-10 bg-primary-50 border-primary-500 text-primary-600'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>

                        {showEllipsisAfter && (
                          <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                            ...
                          </span>
                        )}
                      </React.Fragment>
                    );
                  })}

                <Button
                  variant="outline"
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  <span className="sr-only">{t('common.next', 'Weiter')}</span>
                  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                </Button>
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title={t('carrier.availabilities.deleteTitle', 'Verfügbarkeit löschen')}
        message={t('carrier.availabilities.deleteMessage', 'Sind Sie sicher, dass Sie diese Verfügbarkeit löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')}
        confirmText={t('common.delete', 'Löschen')}
        cancelText={t('common.cancel', 'Abbrechen')}
        isLoading={isDeleting}
        variant="danger"
      />
    </CarrierLayout>
  );
};

export default AvailabilityPage;
