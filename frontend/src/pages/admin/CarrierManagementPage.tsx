import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout';
import CarrierTable from '../../components/admin/CarrierTable';
import CarrierForm from '../../components/admin/CarrierForm';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Carrier, getCarriers, createCarrier, updateCarrier, deleteCarrier, CarrierFilters } from '../../services/carrierService';
import { useNotification } from '../../hooks/useNotification';
import { useNavigate } from 'react-router-dom';

const CarrierManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();
  const navigate = useNavigate();

  // State for carriers data
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCarriers, setTotalCarriers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // State for carrier form
  const [showForm, setShowForm] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [carrierToDelete, setCarrierToDelete] = useState<Carrier | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load carriers on component mount and when filters change
  useEffect(() => {
    fetchCarriers();
  }, [currentPage, pageSize, statusFilter]);

  // Function to fetch carriers with current filters
  const fetchCarriers = async () => {
    setIsLoading(true);

    try {
      // Prepare filters
      const filters: CarrierFilters = {
        page: currentPage,
        limit: pageSize,
        sortBy: 'name',
        sortOrder: 'asc',
      };

      if (searchQuery) {
        filters.search = searchQuery;
      }

      if (statusFilter) {
        filters.isActive = statusFilter === 'active';
      }

      // Fetch carriers
      const response = await getCarriers(filters);

      // Update state
      setCarriers(response.data);
      setTotalCarriers(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Error fetching carriers:', error);
      showError(t('admin.carriers.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchCarriers();
  };

  // Handle create carrier
  const handleCreateCarrier = () => {
    setSelectedCarrier(undefined);
    setShowForm(true);
  };

  // Handle edit carrier
  const handleEditCarrier = (carrier: Carrier) => {
    setSelectedCarrier(carrier);
    setShowForm(true);
  };

  // Handle delete carrier
  const handleDeleteClick = (carrier: Carrier) => {
    setCarrierToDelete(carrier);
    setShowDeleteConfirm(true);
  };

  // Handle view facilities
  const handleViewFacilities = (carrier: Carrier) => {
    // Navigate to facilities page filtered by carrier
    navigate(`/admin/facilities?carrierId=${carrier.id}`);
  };

  // Handle form submission (create or update)
  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);

    try {
      if (selectedCarrier) {
        // Update existing carrier
        await updateCarrier(selectedCarrier.id, values);
        showSuccess(t('admin.carriers.updateSuccess'));
      } else {
        // Create new carrier
        await createCarrier(values);
        showSuccess(t('admin.carriers.createSuccess'));
      }

      // Close form and refresh carriers
      setShowForm(false);
      fetchCarriers();
    } catch (error) {
      console.error('Error saving carrier:', error);
      showError(t('admin.carriers.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle carrier deletion confirmation
  const handleDeleteConfirm = async () => {
    if (!carrierToDelete) return;

    setIsDeleting(true);

    try {
      await deleteCarrier(carrierToDelete.id);
      showSuccess(t('admin.carriers.deleteSuccess'));
      setShowDeleteConfirm(false);
      fetchCarriers();
    } catch (error) {
      console.error('Error deleting carrier:', error);
      showError(t('admin.carriers.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Render carrier form or carrier table based on state
  const renderContent = () => {
    if (showForm) {
      return (
        <CarrierForm
          carrier={selectedCarrier}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowForm(false)}
          isLoading={isSubmitting}
        />
      );
    }

    return (
      <>
        {/* Filters and search */}
        <div className="bg-white shadow sm:rounded-lg mb-6">
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Search */}
              <div className="sm:col-span-3">
                <form onSubmit={handleSearch}>
                  <Input
                    type="text"
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Status filter */}
              <div className="sm:col-span-1">
                <select
                  className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">{t('admin.carriers.allStatuses')}</option>
                  <option value="active">{t('carrier.active')}</option>
                  <option value="inactive">{t('carrier.inactive')}</option>
                </select>
              </div>

              {/* Create button */}
              <div className="sm:col-span-2 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleCreateCarrier}
                  leftIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  {t('admin.carriers.createCarrier')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Carrier table */}
        <CarrierTable
          carriers={carriers}
          isLoading={isLoading}
          onEdit={handleEditCarrier}
          onDelete={handleDeleteClick}
          onViewFacilities={handleViewFacilities}
        />

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
            <div className="flex-1 flex justify-between sm:hidden">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                {t('common.previous')}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                {t('common.next')}
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  {t('common.showing')} <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> {t('common.to')}{' '}
                  <span className="font-medium">{Math.min(currentPage * pageSize, totalCarriers)}</span> {t('common.of')}{' '}
                  <span className="font-medium">{totalCarriers}</span> {t('common.results')}
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
                    <span className="sr-only">{t('common.previous')}</span>
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
                    <span className="sr-only">{t('common.next')}</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </Button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <AdminLayout
      title={t('admin.carriers.title')}
      breadcrumbs={[
        { label: t('admin.dashboard.title'), path: '/admin' },
        { label: t('admin.carriers.title'), path: '/admin/carriers' }
      ]}
    >
      {renderContent()}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title={t('admin.carriers.deleteTitle')}
        message={t('admin.carriers.deleteMessage', { name: carrierToDelete?.name || '' })}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isLoading={isDeleting}
        variant="danger"
      />
    </AdminLayout>
  );
};

export default CarrierManagementPage;
