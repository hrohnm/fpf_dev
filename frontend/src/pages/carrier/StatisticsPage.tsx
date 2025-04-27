import React from 'react';
import { useTranslation } from 'react-i18next';
import CarrierLayout from '../../components/layout/CarrierLayout';

const StatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <CarrierLayout
      title={t('carrier.statistics.title', 'Statistiken')}
      breadcrumbs={[
        { label: t('carrier.dashboard.title', 'Träger Dashboard'), path: '/carrier' },
        { label: t('carrier.statistics.title', 'Statistiken'), path: '/carrier/statistics' }
      ]}
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {t('carrier.statistics.title', 'Statistiken')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t('carrier.statistics.description', 'Hier finden Sie Statistiken zu Ihren Einrichtungen und Belegungen.')}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-gray-500">{t('common.comingSoon', 'Demnächst verfügbar')}</p>
        </div>
      </div>
    </CarrierLayout>
  );
};

export default StatisticsPage;
