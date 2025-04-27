import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import AdminLayout from '../../components/layout/AdminLayout';
import DashboardStats from '../../components/dashboard/DashboardStats';

const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  return (
    <AdminLayout
      title={t('admin.dashboard.title')}
      breadcrumbs={[
        { label: t('admin.dashboard.title'), path: '/admin' }
      ]}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {t('admin.dashboard.welcome', { name: user?.firstName })}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('admin.dashboard.overview')}
        </p>
      </div>
      
      <DashboardStats />
    </AdminLayout>
  );
};

export default AdminDashboardPage;
