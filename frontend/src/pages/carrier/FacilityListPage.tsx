import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import CarrierLayout from '../../components/layout/CarrierLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import { Facility, getFacilities, deleteFacility, FacilityFilters } from '../../services/facilityService';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';

const FacilityListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { user } = useAuth();

  // State
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [totalFacilities, setTotalFacilities] = useState<number>(0);
  const [pageSize] = useState<number>(10);
  const [facilityToDelete, setFacilityToDelete] = useState<Facility | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  // Fetch facilities
  const fetchFacilities = async () => {
    setIsLoading(true);

    try {
      const filters: FacilityFilters = {
        page: currentPage,
        limit: pageSize,
        search: searchQuery || undefined,
        sortBy: 'name',
        sortOrder: 'asc',
      };

      const response = await getFacilities(filters);
      setFacilities(response.data);
      setTotalPages(response.meta.totalPages);
      setTotalFacilities(response.meta.total);
    } catch (error) {
      console.error('Error fetching facilities:', error);
      showError(t('carrier.facilities.fetchError', 'Fehler beim Laden der Einrichtungen'));
    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFacilities();
  }, [currentPage]);

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchFacilities();
  };

  // Handle create facility
  const handleCreateFacility = () => {
    navigate('/carrier/facilities/new');
  };

  // Handle edit facility
  const handleEditFacility = (facility: Facility) => {
    navigate(`/carrier/facilities/${facility.id}`);
  };

  // Handle delete facility
  const handleDeleteClick = (facility: Facility) => {
    setFacilityToDelete(facility);
    setShowDeleteConfirm(true);
  };

  // Handle delete confirmation
  const handleDeleteConfirm = async () => {
    if (!facilityToDelete) return;

    setIsDeleting(true);

    try {
      await deleteFacility(facilityToDelete.id.toString());
      showSuccess(t('carrier.facilities.deleteSuccess', 'Einrichtung erfolgreich gelöscht'));
      setShowDeleteConfirm(false);
      fetchFacilities();
    } catch (error) {
      console.error('Error deleting facility:', error);
      showError(t('carrier.facilities.deleteError', 'Fehler beim Löschen der Einrichtung'));
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <CarrierLayout
      title={t('carrier.facilities.title', 'Einrichtungen')}
      breadcrumbs={[
        { label: t('carrier.dashboard.title', 'Träger Dashboard'), path: '/carrier' },
        { label: t('carrier.facilities.title', 'Einrichtungen'), path: '/carrier/facilities' }
      ]}
    >
      {/* Filters and search */}
      <div className="bg-white shadow sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center">
            <form onSubmit={handleSearch} className="w-full max-w-lg">
              <Input
                type="text"
                placeholder={t('common.search', 'Suchen...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </form>

            <Button
              variant="primary"
              onClick={handleCreateFacility}
              leftIcon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
              }
            >
              {t('carrier.facilities.create', 'Neue Einrichtung')}
            </Button>
          </div>
        </div>
      </div>

      {/* Facilities list */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : facilities.length === 0 ? (
        <Card className="p-6 text-center">
          <p className="text-gray-500">
            {searchQuery
              ? t('carrier.facilities.noSearchResults', 'Keine Einrichtungen gefunden, die Ihren Suchkriterien entsprechen.')
              : t('carrier.facilities.noFacilities', 'Sie haben noch keine Einrichtungen. Klicken Sie auf "Neue Einrichtung", um eine zu erstellen.')}
          </p>
        </Card>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('facility.name', 'Name')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('facility.address', 'Adresse')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('facility.contactPerson', 'Ansprechpartner')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('facility.status', 'Status')}
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('common.actions', 'Aktionen')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facilities.map((facility) => (
                  <tr key={facility.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{facility.name}</div>
                      <div className="text-sm text-gray-500">{facility.maxCapacity} {t('facility.places', 'Plätze')}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{facility.address}</div>
                      <div className="text-sm text-gray-500">{facility.postalCode} {facility.city}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{facility.contactPerson}</div>
                      <div className="text-sm text-gray-500">{facility.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        facility.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {facility.isActive
                          ? t('common.active', 'Aktiv')
                          : t('common.inactive', 'Inaktiv')}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="primary"
                        onClick={() => handleEditFacility(facility)}
                        className="text-primary-600 hover:text-primary-900 mr-2"
                      >
                        {t('common.edit', 'Bearbeiten')}
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleDeleteClick(facility)}
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
                <span className="font-medium">{Math.min(currentPage * pageSize, totalFacilities)}</span> {t('common.of', 'von')}{' '}
                <span className="font-medium">{totalFacilities}</span> {t('common.results', 'Ergebnissen')}
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
        title={t('carrier.facilities.deleteTitle', 'Einrichtung löschen')}
        message={facilityToDelete ? `Sind Sie sicher, dass Sie die Einrichtung "${facilityToDelete.name}" löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.` : t('carrier.facilities.deleteMessage', 'Sind Sie sicher, dass Sie diese Einrichtung löschen möchten? Diese Aktion kann nicht rückgängig gemacht werden.')}
        confirmText={t('common.delete', 'Löschen')}
        cancelText={t('common.cancel', 'Abbrechen')}
        isLoading={isDeleting}
        variant="danger"
      />
    </CarrierLayout>
  );
};

export default FacilityListPage;
