import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout';
import UserTable from '../../components/admin/UserTable';
import UserForm from '../../components/admin/UserForm';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { User, UserRole } from '../../types/auth.types';
import { getUsers, createUser, updateUser, deleteUser, UserFilters } from '../../services/userService';
import { useNotification } from '../../hooks/useNotification';

const UserManagementPage: React.FC = () => {
  const { t } = useTranslation();
  const { showSuccess, showError } = useNotification();

  // State for users data
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // State for search and filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // State for user form
  const [showForm, setShowForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State for delete confirmation
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Load users on component mount and when filters change
  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize, roleFilter, statusFilter]);

  // Function to fetch users with current filters
  const fetchUsers = async () => {
    setIsLoading(true);

    try {
      // Prepare filters
      const filters: UserFilters = {
        page: currentPage,
        limit: pageSize,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      if (searchQuery) {
        filters.search = searchQuery;
      }

      if (roleFilter) {
        filters.role = roleFilter;
      }

      if (statusFilter) {
        filters.isActive = statusFilter === 'active';
      }

      // Fetch users
      const response = await getUsers(filters);

      // Update state
      setUsers(response.data);
      setTotalUsers(response.meta.total);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      showError(t('admin.users.fetchError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchUsers();
  };

  // Handle create user
  const handleCreateUser = () => {
    setSelectedUser(undefined);
    setShowForm(true);
  };

  // Handle edit user
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  // Handle delete user
  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // Handle form submission (create or update)
  const handleFormSubmit = async (values: any) => {
    setIsSubmitting(true);

    try {
      // Prepare data for API
      const userData = { ...values };

      // Convert carrierId to carrierIds array if present
      if (userData.carrierId) {
        userData.carrierIds = [userData.carrierId];
        delete userData.carrierId;
      }

      if (selectedUser) {
        // Update existing user
        await updateUser(selectedUser.id, userData);
        showSuccess(t('admin.users.updateSuccess'));
      } else {
        // Create new user
        await createUser(userData);
        showSuccess(t('admin.users.createSuccess'));
      }

      // Close form and refresh users
      setShowForm(false);
      fetchUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      showError(t('admin.users.saveError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle user deletion confirmation
  const handleDeleteConfirm = async () => {
    if (!userToDelete) return;

    setIsDeleting(true);

    try {
      await deleteUser(userToDelete.id);
      showSuccess(t('admin.users.deleteSuccess'));
      setShowDeleteConfirm(false);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      showError(t('admin.users.deleteError'));
    } finally {
      setIsDeleting(false);
    }
  };

  // Render user form or user table based on state
  const renderContent = () => {
    if (showForm) {
      return (
        <UserForm
          user={selectedUser}
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
              <div className="sm:col-span-2">
                <form onSubmit={handleSearch}>
                  <Input
                    type="text"
                    placeholder={t('common.search')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Role filter */}
              <div className="sm:col-span-1">
                <select
                  className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                  value={roleFilter}
                  onChange={(e) => {
                    setRoleFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="">{t('admin.users.allRoles')}</option>
                  <option value={UserRole.ADMIN}>{t('user.roles.admin')}</option>
                  <option value={UserRole.CARRIER}>{t('user.roles.carrier')}</option>
                  <option value={UserRole.MANAGER}>{t('user.roles.manager')}</option>
                  <option value={UserRole.LEADERSHIP}>{t('user.roles.leadership')}</option>
                </select>
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
                  <option value="">{t('admin.users.allStatuses')}</option>
                  <option value="active">{t('user.active')}</option>
                  <option value="inactive">{t('user.inactive')}</option>
                </select>
              </div>

              {/* Create button */}
              <div className="sm:col-span-2 flex justify-end">
                <Button
                  variant="primary"
                  onClick={handleCreateUser}
                  leftIcon={
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                  }
                >
                  {t('admin.users.createUser')}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* User table */}
        <UserTable
          users={users}
          isLoading={isLoading}
          onEdit={handleEditUser}
          onDelete={handleDeleteClick}
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
                  <span className="font-medium">{Math.min(currentPage * pageSize, totalUsers)}</span> {t('common.of')}{' '}
                  <span className="font-medium">{totalUsers}</span> {t('common.results')}
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
      title={t('admin.users.title')}
      breadcrumbs={[
        { label: t('admin.dashboard.title'), path: '/admin' },
        { label: t('admin.users.title'), path: '/admin/users' }
      ]}
    >
      {renderContent()}

      {/* Delete confirmation dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDeleteConfirm}
        title={t('admin.users.deleteTitle')}
        message={t('admin.users.deleteMessage', { name: userToDelete ? `${userToDelete.firstName} ${userToDelete.lastName}` : '' })}
        confirmText={t('common.delete')}
        cancelText={t('common.cancel')}
        isLoading={isDeleting}
        variant="danger"
      />
    </AdminLayout>
  );
};

export default UserManagementPage;
