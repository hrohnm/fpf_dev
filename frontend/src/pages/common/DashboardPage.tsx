import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '../../components/layout/Layout';
import DashboardStats from '../../components/dashboard/DashboardStats';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            {t('navigation.dashboard')}
          </h1>
          
          <DashboardStats />
        </div>
      </div>
    </Layout>
  );
};

export default DashboardPage;
