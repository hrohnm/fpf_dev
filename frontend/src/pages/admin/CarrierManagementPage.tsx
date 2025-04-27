import React from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '../../components/layout/AdminLayout';

const CarrierManagementPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <AdminLayout
      title={t('admin.carriers.title')}
      breadcrumbs={[
        { label: t('admin.dashboard.title'), path: '/admin' },
        { label: t('admin.carriers.title'), path: '/admin/carriers' }
      ]}
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('admin.carriers.title')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t('admin.carriers.description')}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-gray-500">{t('common.comingSoon')}</p>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CarrierManagementPage;
