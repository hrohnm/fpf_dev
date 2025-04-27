import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Carrier } from '../../services/carrierService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';

interface CarrierFormProps {
  carrier?: Carrier;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const CarrierForm: React.FC<CarrierFormProps> = ({ carrier, onSubmit, onCancel, isLoading }) => {
  const { t } = useTranslation();
  const isEditMode = !!carrier;

  // Initial form values
  const initialValues = {
    name: carrier?.name || '',
    description: carrier?.description || '',
    contactPerson: carrier?.contactPerson || '',
    email: carrier?.email || '',
    phone: carrier?.phone || '',
    website: carrier?.website || '',
    address: carrier?.address || '',
    isActive: carrier?.isActive !== undefined ? carrier.isActive : true,
  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required(t('validation.required')),
    description: Yup.string(),
    contactPerson: Yup.string().required(t('validation.required')),
    email: Yup.string().email(t('validation.email')).required(t('validation.required')),
    phone: Yup.string().required(t('validation.required')),
    website: Yup.string().url(t('validation.url')),
    address: Yup.string().required(t('validation.required')),
    isActive: Yup.boolean(),
  });

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isEditMode ? t('admin.carriers.editCarrier') : t('admin.carriers.createCarrier')}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {isEditMode ? t('admin.carriers.editCarrierDescription') : t('admin.carriers.createCarrierDescription')}
        </p>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                {/* Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    {t('carrier.name')}
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

                {/* Contact Person */}
                <div className="sm:col-span-3">
                  <label htmlFor="contactPerson" className="block text-sm font-medium text-gray-700">
                    {t('carrier.contactPerson')}
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
                    {t('carrier.email')}
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
                    {t('carrier.phone')}
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

                {/* Website */}
                <div className="sm:col-span-3">
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700">
                    {t('carrier.website')}
                  </label>
                  <div className="mt-1">
                    <Field
                      as={Input}
                      type="text"
                      name="website"
                      id="website"
                      error={touched.website && errors.website ? errors.website : undefined}
                    />
                  </div>
                </div>

                {/* Address */}
                <div className="sm:col-span-3">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    {t('carrier.address')}
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

                {/* Description */}
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    {t('carrier.description')}
                  </label>
                  <div className="mt-1">
                    <Field
                      as="textarea"
                      name="description"
                      id="description"
                      rows={3}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      error={touched.description && errors.description ? errors.description : undefined}
                    />
                    <ErrorMessage name="description" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                {/* Active Status */}
                <div className="sm:col-span-6">
                  <div className="flex items-center">
                    <Toggle
                      enabled={values.isActive}
                      setEnabled={(value) => setFieldValue('isActive', value)}
                      label={t('carrier.isActive')}
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {t('carrier.isActive')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={isSubmitting || isLoading}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={isSubmitting || isLoading}
                >
                  {isEditMode ? t('common.save') : t('common.create')}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CarrierForm;
