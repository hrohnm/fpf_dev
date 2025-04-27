import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import CarrierLayout from '../../components/layout/CarrierLayout';

const FacilityFormPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const isEditMode = !!id;
  
  return (
    <CarrierLayout
      title={isEditMode ? t('carrier.facilities.edit', 'Einrichtung bearbeiten') : t('carrier.facilities.new', 'Neue Einrichtung')}
      breadcrumbs={[
        { label: t('carrier.dashboard.title', 'Träger Dashboard'), path: '/carrier' },
        { label: t('carrier.facilities.title', 'Einrichtungen'), path: '/carrier/facilities' },
        { label: isEditMode ? t('carrier.facilities.edit', 'Einrichtung bearbeiten') : t('carrier.facilities.new', 'Neue Einrichtung'), path: isEditMode ? `/carrier/facilities/${id}` : '/carrier/facilities/new' }
      ]}
    >
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {isEditMode ? t('carrier.facilities.edit', 'Einrichtung bearbeiten') : t('carrier.facilities.new', 'Neue Einrichtung')}
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {t('carrier.facilities.formDescription', 'Hier können Sie die Details Ihrer Einrichtung bearbeiten.')}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          <p className="text-gray-500">{t('common.comingSoon', 'Demnächst verfügbar')}</p>
        </div>
      </div>
    </CarrierLayout>
  );
};

export default FacilityFormPage;
