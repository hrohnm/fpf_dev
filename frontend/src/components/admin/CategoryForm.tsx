import React, { useState, useEffect } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { Category, CategoryUnitType, getAllCategories } from '../../services/categoryService';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Toggle from '../ui/Toggle';
import RadioGroup from '../ui/RadioGroup';

interface CategoryFormProps {
  category?: Category;
  onSubmit: (values: any) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel, isLoading }) => {
  const { t } = useTranslation();
  const isEditMode = !!category;
  const [parentCategories, setParentCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);

  // Load parent categories for dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoadingCategories(true);
      try {
        const categoriesData = await getAllCategories();
        // Filter out the current category (can't be its own parent) and inactive categories
        const filteredCategories = categoriesData.filter(c => 
          c.isActive && (!category || c.id !== category.id)
        );
        setParentCategories(filteredCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [category]);

  // Initial form values
  const initialValues = {
    name: category?.name || '',
    description: category?.description || '',
    code: category?.code || '',
    unitType: category?.unitType || CategoryUnitType.PLACES,
    parentId: category?.parentId || '',
    isActive: category?.isActive !== undefined ? category.isActive : true,
  };

  // Validation schema
  const validationSchema = Yup.object({
    name: Yup.string().required(t('validation.required')),
    description: Yup.string(),
    code: Yup.string().required(t('validation.required')),
    unitType: Yup.string()
      .oneOf(Object.values(CategoryUnitType), t('validation.invalidUnitType'))
      .required(t('validation.required')),
    parentId: Yup.string(),
    isActive: Yup.boolean(),
  });

  // Unit type options
  const unitTypeOptions = [
    { value: CategoryUnitType.PLACES, label: t('category.unitTypes.places') },
    { value: CategoryUnitType.HOURS, label: t('category.unitTypes.hours') },
  ];

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {isEditMode ? t('admin.categories.editCategory') : t('admin.categories.createCategory')}
        </h3>
        <p className="mt-1 max-w-2xl text-sm text-gray-500">
          {isEditMode ? t('admin.categories.editCategoryDescription') : t('admin.categories.createCategoryDescription')}
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
                    {t('category.name')}
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

                {/* Code */}
                <div className="sm:col-span-3">
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">
                    {t('category.code')}
                  </label>
                  <div className="mt-1">
                    <Field
                      as={Input}
                      type="text"
                      name="code"
                      id="code"
                      error={touched.code && errors.code ? errors.code : undefined}
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="sm:col-span-6">
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                    {t('category.description')}
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

                {/* Unit Type */}
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('category.unitType')}
                  </label>
                  <RadioGroup
                    options={unitTypeOptions}
                    value={values.unitType}
                    onChange={(value) => setFieldValue('unitType', value)}
                  />
                  <ErrorMessage name="unitType" component="p" className="mt-1 text-sm text-red-600" />
                  <p className="mt-2 text-sm text-gray-500">
                    {values.unitType === CategoryUnitType.PLACES 
                      ? t('category.unitTypeDescriptions.places')
                      : t('category.unitTypeDescriptions.hours')}
                  </p>
                </div>

                {/* Parent Category */}
                <div className="sm:col-span-3">
                  <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
                    {t('category.parentCategory')}
                  </label>
                  <div className="mt-1">
                    <Field
                      as="select"
                      name="parentId"
                      id="parentId"
                      className="block w-full shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm border-gray-300 rounded-md"
                      disabled={isLoadingCategories}
                    >
                      <option value="">{t('category.noParent')}</option>
                      {parentCategories.map((parentCategory) => (
                        <option key={parentCategory.id} value={parentCategory.id}>
                          {parentCategory.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="parentId" component="p" className="mt-1 text-sm text-red-600" />
                  </div>
                </div>

                {/* Active Status */}
                <div className="sm:col-span-3">
                  <div className="flex items-center h-full pt-5">
                    <Toggle
                      enabled={values.isActive}
                      setEnabled={(value) => setFieldValue('isActive', value)}
                      label={t('category.isActive')}
                    />
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {t('category.isActive')}
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

export default CategoryForm;
