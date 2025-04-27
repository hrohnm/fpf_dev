import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import CarrierLayout from '../../components/layout/CarrierLayout';
import DashboardStats from '../../components/dashboard/DashboardStats';

const CarrierDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <CarrierLayout
      title={t('carrier.dashboard.title', 'Träger Dashboard')}
      breadcrumbs={[
        { label: t('carrier.dashboard.title', 'Träger Dashboard'), path: '/carrier' }
      ]}
    >
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">
          {t('carrier.dashboard.welcome', { name: user?.firstName }, 'Willkommen, {{name}}')}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {t('carrier.dashboard.overview', 'Hier finden Sie eine Übersicht über Ihre Einrichtungen und Verfügbarkeiten.')}
        </p>
      </div>

      <DashboardStats />
    </CarrierLayout>
  );
};

export default CarrierDashboardPage;
