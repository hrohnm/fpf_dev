import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { User, UserRole, Carrier } from '../../types/auth.types';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';
import { getAllCarriers } from '../../services/carrierService';

interface UserFormProps {
  user?: User;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel, isLoading }) => {
  const { t } = useTranslation();
  const isEditMode = !!user;
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const [isLoadingCarriers, setIsLoadingCarriers] = useState(false);

  // Load carriers for dropdown
  useEffect(() => {
    const fetchCarriers = async () => {
      setIsLoadingCarriers(true);
      try {
        const carriersData = await getAllCarriers();
        setCarriers(carriersData);
      } catch (error) {
        console.error('Error fetching carriers:', error);
      } finally {
        setIsLoadingCarriers(false);
      }
    };

    fetchCarriers();
  }, []);

  // Initial form values
  const initialValues = {
    email: user?.email || '',
    password: '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    role: user?.role || UserRole.MANAGER,
    isActive: user?.isActive !== undefined ? user.isActive : true,
    carrierId: user?.carrierId || '',
  };

  // Validation schema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email(t('validation.email'))
      .required(t('validation.required')),
    password: isEditMode
      ? Yup.string().min(8, t('validation.passwordLength'))
      : Yup.string()
          .min(8, t('validation.passwordLength'))
          .required(t('validation.required')),
    firstName: Yup.string().required(t('validation.required')),
    lastName: Yup.string().required(t('validation.required')),
    role: Yup.string()
      .oneOf(Object.values(UserRole), t('validation.invalidRole'))
      .required(t('validation.required')),
    isActive: Yup.boolean(),
    carrierId: Yup.string().when('role', (role, schema) => {
      return role === UserRole.CARRIER
        ? schema.required(t('validation.carrierRequired'))
        : schema;
    }),
  });

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isEditMode ? t('admin.users.editUser') : t('admin.users.createUser')}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {isEditMode ? t('admin.users.editUserDescription') : t('admin.users.createUserDescription')}
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
                {/* Email */}
                <div className="sm:col-span-3">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    {t('user.email')}
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

                {/* Password */}
                <div className="sm:col-span-3">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    {t('user.password')} {isEditMode && <span className="text-gray-500 text-xs">({t('admin.users.leaveEmptyToKeep')})</span>}
                  </label>
                  <div className="mt-1">
                    <Field
                      as={Input}
                      type="password"
                      name="password"
                      id="password"
                      error={touched.password && errors.password ? errors.password : undefined}
                    />
                  </div>
                </div>

                {/* First Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                    {t('user.firstName')}
                  </label>
                  <div className="mt-1">
                    <Field
                      as={Input}
                      type="text"
                      name="firstName"
                      id="firstName"
                      error={touched.firstName && errors.firstName ? errors.firstName : undefined}
                    />
                  </div>
                </div>

                {/* Last Name */}
                <div className="sm:col-span-3">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                    {t('user.lastName')}
                  </label>
                  <div className="mt-1">
                    <Field
                      as={Input}
                      type="text"
                      name="lastName"
                      id="lastName"
                      error={touched.lastName && errors.lastName ? errors.lastName : undefined}
                    />
                  </div>
                </div>

                {/* Role */}
                <div className="sm:col-span-3">
                  <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                    {t('user.role')}
                  </label>
                  <div className="mt-1">
                    <Field
                      as="select"
                      name="role"
                      id="role"
                      className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value={UserRole.ADMIN}>{t('user.roles.admin')}</option>
                      <option value={UserRole.CARRIER}>{t('user.roles.carrier')}</option>
                      <option value={UserRole.MANAGER}>{t('user.roles.manager')}</option>
                      <option value={UserRole.LEADERSHIP}>{t('user.roles.leadership')}</option>
                    </Field>
                    <ErrorMessage name="role" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                {/* Active Status */}
                <div className="sm:col-span-3">
                  <div className="flex items-center h-full pt-5">
                    <Toggle
                      enabled={values.isActive}
                      setEnabled={(value) => setFieldValue('isActive', value)}
                      label={t('user.isActive')}
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {t('user.isActive')}
                    </span>
                  </div>
                </div>

                {/* Carrier Selection - only shown when role is carrier */}
                {values.role === UserRole.CARRIER && (
                  <div className="sm:col-span-3">
                    <label htmlFor="carrierId" className="block text-sm font-medium text-gray-700">
                      {t('user.carrier')}
                    </label>
                    <div className="mt-1">
                      <Field
                        as="select"
                        name="carrierId"
                        id="carrierId"
                        className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                        disabled={isLoadingCarriers}
                      >
                        <option value="">{t('admin.users.selectCarrier')}</option>
                        {carriers.map((carrier) => (
                          <option key={carrier.id} value={carrier.id}>
                            {carrier.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="carrierId" component="p" className="mt-1 text-sm text-red-600" />
                    </div>
                  </div>
                )}
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

export default UserForm;
