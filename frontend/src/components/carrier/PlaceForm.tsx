import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Place } from '../../types/place.types';
import { Category } from '../../types/carrier.types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { RadioGroup } from '../ui/RadioGroup';

interface PlaceFormProps {
  place?: Partial<Place>;
  categories: Category[];
  facilityId: string;
  maxCapacity: number;
  currentPlacesCount: number;
  onSubmit: (place: Partial<Place>) => void;
  onCancel: () => void;
}

const PlaceForm: React.FC<PlaceFormProps> = ({
  place,
  categories,
  facilityId,
  maxCapacity,
  currentPlacesCount,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const isEditing = !!place?.id;
  
  const [formData, setFormData] = useState<Partial<Place>>({
    facilityId,
    categoryId: '',
    name: '',
    isOccupied: false,
    genderSuitability: 'all',
    minAge: 0,
    maxAge: 27,
    notes: '',
    ...place,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check if we can add more places
  const canAddPlace = isEditing || currentPlacesCount < maxCapacity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: parseInt(value, 10) }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleRadioChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = t('validation.required');
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = t('validation.required');
    }
    
    if (formData.minAge < 0) {
      newErrors.minAge = t('validation.minValue', { value: 0 });
    }
    
    if (formData.maxAge > 27) {
      newErrors.maxAge = t('validation.maxValue', { value: 27 });
    }
    
    if (formData.minAge > formData.maxAge) {
      newErrors.minAge = t('validation.minAgeLessThanMax');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canAddPlace && !isEditing) {
      setErrors({
        form: t('place.errors.maxCapacityReached', { maxCapacity }),
      });
      return;
    }
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {!canAddPlace && !isEditing && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                {t('place.errors.maxCapacityReached', { maxCapacity })}
              </p>
            </div>
          </div>
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {t('place.name')} *
        </label>
        <Input
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
          required
        />
      </div>

      <div>
        <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
          {t('place.category')} *
        </label>
        <Select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={handleChange}
          error={errors.categoryId}
          required
        >
          <option value="">{t('common.select')}</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div>
        <div className="block text-sm font-medium text-gray-700 mb-2">
          {t('place.status')}
        </div>
        <div className="flex items-center">
          <input
            id="isOccupied"
            name="isOccupied"
            type="checkbox"
            checked={formData.isOccupied}
            onChange={handleCheckboxChange}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="isOccupied" className="ml-2 block text-sm text-gray-900">
            {t('place.occupied')}
          </label>
        </div>
      </div>

      <div>
        <div className="block text-sm font-medium text-gray-700 mb-2">
          {t('place.genderSuitability.label')}
        </div>
        <RadioGroup
          name="genderSuitability"
          value={formData.genderSuitability as string}
          onChange={(value) => handleRadioChange('genderSuitability', value)}
          options={[
            { value: 'all', label: t('place.genderSuitability.all') },
            { value: 'male', label: t('place.genderSuitability.male') },
            { value: 'female', label: t('place.genderSuitability.female') },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
        <div>
          <label htmlFor="minAge" className="block text-sm font-medium text-gray-700">
            {t('place.minAge')}
          </label>
          <Input
            id="minAge"
            name="minAge"
            type="number"
            min={0}
            max={27}
            value={formData.minAge}
            onChange={handleNumberChange}
            error={errors.minAge}
          />
        </div>
        <div>
          <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700">
            {t('place.maxAge')}
          </label>
          <Input
            id="maxAge"
            name="maxAge"
            type="number"
            min={0}
            max={27}
            value={formData.maxAge}
            onChange={handleNumberChange}
            error={errors.maxAge}
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          {t('place.notes')}
        </label>
        <TextArea
          id="notes"
          name="notes"
          value={formData.notes || ''}
          onChange={handleChange}
          rows={3}
        />
      </div>

      {errors.form && (
        <div className="text-red-500 text-sm mt-2">
          {errors.form}
        </div>
      )}

      <div className="flex justify-end space-x-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          {t('common.cancel')}
        </Button>
        <Button
          type="submit"
          disabled={!canAddPlace && !isEditing}
        >
          {isEditing ? t('common.save') : t('common.create')}
        </Button>
      </div>
    </form>
  );
};

export default PlaceForm;
