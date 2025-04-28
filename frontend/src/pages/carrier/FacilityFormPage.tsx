import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import CarrierLayout from '../../components/layout/CarrierLayout';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Toggle from '../../components/ui/Toggle';
import { Facility, getFacilityById, createFacility, updateFacility } from '../../services/facilityService';
import { useNotification } from '../../hooks/useNotification';
import { useAuth } from '../../hooks/useAuth';

const FacilityFormPage: React.FC = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const { user } = useAuth();
  const isEditMode = !!id;

  const [facility, setFacility] = useState<Facility | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch facility data if in edit mode
  useEffect(() => {
    if (isEditMode && id) {
      const fetchFacility = async () => {
        try {
          const data = await getFacilityById(id);
          setFacility(data);
        } catch (error) {
          console.error('Error fetching facility:', error);
          showError(t('carrier.facilities.fetchError', 'Fehler beim Laden der Einrichtung'));
          navigate('/carrier/facilities');
        } finally {
          setIsLoading(false);
        }
      };

      fetchFacility();
    } else {
      setIsLoading(false);
    }
  }, [id, isEditMode, navigate]);

  // Initial form values
  const initialValues = {
    name: facility?.name || '',
    description: facility?.description || '',
    contactPerson: facility?.contactPerson || '',
    email: facility?.email || '',
    phone: facility?.phone || '',
    address: facility?.address || '',
    city: facility?.city || '',
    postalCode: facility?.postalCode || '',
    latitude: facility?.latitude || undefined,
    longitude: facility?.longitude || undefined,
    openingHours: facility?.openingHours || '',
    maxCapacity: facility?.maxCapacity || 1,
    isActive: facility?.isActive !== undefined ? facility.isActive : true,
    carrierId: facility?.carrierId || user?.carrierId || '',
  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required(t('validation.required', 'Dieses Feld ist erforderlich')),
    contactPerson: Yup.string().required(t('validation.required', 'Dieses Feld ist erforderlich')),
    email: Yup.string()
      .email(t('validation.email', 'Bitte geben Sie eine gültige E-Mail-Adresse ein'))
      .required(t('validation.required', 'Dieses Feld ist erforderlich')),
    phone: Yup.string().required(t('validation.required', 'Dieses Feld ist erforderlich')),
    address: Yup.string().required(t('validation.required', 'Dieses Feld ist erforderlich')),
    city: Yup.string().required(t('validation.required', 'Dieses Feld ist erforderlich')),
    postalCode: Yup.string().required(t('validation.required', 'Dieses Feld ist erforderlich')),
    maxCapacity: Yup.number()
      .required(t('validation.required', 'Dieses Feld ist erforderlich'))
      .min(1, 'Der Wert muss mindestens 1 sein'),
    carrierId: Yup.string().required(t('validation.required', 'Dieses Feld ist erforderlich')),
  });

  // Handle form submission
  const handleSubmit = async (values: any) => {
    setIsSubmitting(true);

    try {
      if (isEditMode && id) {
        // Update existing facility
        await updateFacility(id, values);
        showSuccess(t('carrier.facilities.updateSuccess', 'Einrichtung erfolgreich aktualisiert'));
      } else {
        // Create new facility
        await createFacility(values);
        showSuccess(t('carrier.facilities.createSuccess', 'Einrichtung erfolgreich erstellt'));
      }

      // Navigate back to facilities list
      navigate('/carrier/facilities');
    } catch (error) {
      console.error('Error saving facility:', error);
      showError(t('carrier.facilities.saveError', 'Fehler beim Speichern der Einrichtung'));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    navigate('/carrier/facilities');
  };

  if (isLoading) {
    return (
      <CarrierLayout
        title={isEditMode ? t('carrier.facilities.edit', 'Einrichtung bearbeiten') : t('carrier.facilities.new', 'Neue Einrichtung')}
        breadcrumbs={[
          { label: t('carrier.dashboard.title', 'Träger Dashboard'), path: '/carrier' },
          { label: t('carrier.facilities.title', 'Einrichtungen'), path: '/carrier/facilities' },
          { label: isEditMode ? t('carrier.facilities.edit', 'Einrichtung bearbeiten') : t('carrier.facilities.new', 'Neue Einrichtung'), path: isEditMode ? `/carrier/facilities/${id}` : '/carrier/facilities/new' }
        ]}
      >
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </CarrierLayout>
    );
  }

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
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ values, errors, touched, handleChange, setFieldValue, isValid, dirty }) => (
              <Form className="space-y-6">
                <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  {/* Name */}
                  <div className="sm:col-span-3">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      {t('facility.name', 'Name')} *
                    </label>
                    <div className="mt-1">
                      <Field
                        as={Input}
                        type="text"
                        name="name"
                        id="name"
                        error={touched.name && errors.name ? errors.name : undefined}
                      />
                    </div>
                  </div>

                  {/* Max Capacity */}
                  <div className="sm:col-span-3">
                    <label htmlFor="maxCapacity" className="block text-sm font-medium text-gray-700">
                      {t('facility.maxCapacity', 'Maximale Kapazität')} *
                    </label>
                    <div className="mt-1">
                      <Field
                        as={Input}
                        type="number"
                        name="maxCapacity"
                        id="maxCapacity"
                        min="1"
                        error={touched.maxCapacity && errors.maxCapacity ? errors.maxCapacity : undefined}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div className="sm:col-span-6">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      {t('facility.description', 'Beschreibung')}
                    </label>
                    <div className="mt-1">
                      <Field
                        as="textarea"
                        name="description"
                        id="description"
                        rows={3}
                        className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  {/* Contact Person */}
                  <div className="sm:col-span-3">
                    <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                      {t('facility.contactPerson', 'Ansprechpartner')} *
                    </label>
                    <div className="mt-1">
                      <Field
                        as={Input}
                        type="text"
                        name="contactPerson"
                        id="contactPerson"
                        error={touched.contactPerson && errors.contactPerson ? errors.contactPerson : undefined}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-3">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      {t('facility.email', 'E-Mail')} *
                    </label>
                    <div className="mt-1">
                      <Field
                        as={Input}
                        type="email"
                        name="email"
                        id="email"
                        error={touched.email && errors.email ? errors.email : undefined}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div className="sm:col-span-3">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      {t('facility.phone', 'Telefon')} *
                    </label>
                    <div className="mt-1">
                      <Field
                        as={Input}
                        type="text"
                        name="phone"
                        id="phone"
                        error={touched.phone && errors.phone ? errors.phone : undefined}
                      />
                    </div>
                  </div>

                  {/* Opening Hours */}
                  <div className="sm:col-span-3">
                    <label htmlFor="openingHours" className="block text-sm font-medium text-gray-700">
                      {t('facility.openingHours', 'Öffnungszeiten')}
                    </label>
                    <div className="mt-1">
                      <Field
                        as={Input}
                        type="text"
                        name="openingHours"
                        id="openingHours"
                        error={touched.openingHours && errors.openingHours ? errors.openingHours : undefined}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-6">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      {t('facility.address', 'Adresse')} *
                    </label>
                    <div className="mt-1">
                      <Field
                        as={Input}
                        type="text"
                        name="address"
                        id="address"
                        error={touched.address && errors.address ? errors.address : undefined}
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div className="sm:col-span-3">
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                      {t('facility.city', 'Stadt')} *
                    </label>
                    <div className="mt-1">
                      <Field
                        as={Input}
                        type="text"
                        name="city"
                        id="city"
                        error={touched.city && errors.city ? errors.city : undefined}
                      />
                    </div>
                  </div>

                  {/* Postal Code */}
                  <div className="sm:col-span-3">
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">
                      {t('facility.postalCode', 'Postleitzahl')} *
                    </label>
                    <div className="mt-1">
                      <Field
                        as={Input}
                        type="text"
                        name="postalCode"
                        id="postalCode"
                        error={touched.postalCode && errors.postalCode ? errors.postalCode : undefined}
                      />
                    </div>
                  </div>

                  {/* Latitude */}
                  <div className="sm:col-span-3">
                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                      {t('facility.latitude', 'Breitengrad')}
                    </label>
                    <div className="mt-1">
                      <Field
                        as={Input}
                        type="number"
                        name="latitude"
                        id="latitude"
                        step="0.000001"
                        error={touched.latitude && errors.latitude ? errors.latitude : undefined}
                      />
                    </div>
                  </div>

                  {/* Longitude */}
                  <div className="sm:col-span-3">
                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                      {t('facility.longitude', 'Längengrad')}
                    </label>
                    <div className="mt-1">
                      <Field
                        as={Input}
                        type="number"
                        name="longitude"
                        id="longitude"
                        step="0.000001"
                        error={touched.longitude && errors.longitude ? errors.longitude : undefined}
                      />
                    </div>
                  </div>

                  {/* Active Status */}
                  <div className="sm:col-span-6">
                    <div className="flex items-center">
                      <Toggle
                        enabled={values.isActive}
                        setEnabled={(value) => setFieldValue('isActive', value)}
                        label={t('facility.isActive', 'Aktiv')}
                      />
                      <span className="ml-3 text-sm font-medium text-gray-700">
                        {t('facility.isActive', 'Aktiv')}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {t('facility.isActiveDescription', 'Inaktive Einrichtungen werden in der Suche nicht angezeigt.')}
                    </p>
                  </div>

                  {/* Hidden Carrier ID field */}
                  <input type="hidden" name="carrierId" value={values.carrierId} />
                </div>



                {/* Form Actions */}
                <div className="flex justify-end space-x-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    disabled={isSubmitting}
                  >
                    {t('common.cancel', 'Abbrechen')}
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    isLoading={isSubmitting}
                    disabled={isSubmitting || (!isValid && dirty)}
                  >
                    {isEditMode ? t('common.save', 'Speichern') : t('common.create', 'Erstellen')}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </CarrierLayout>
  );
};

export default FacilityFormPage;
