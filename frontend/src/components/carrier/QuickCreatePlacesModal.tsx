import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { RadioGroup } from '../ui/RadioGroup';
import { Category } from '../../types/carrier.types';
import { BulkPlaceCreationParams } from '../../services/placeService';

interface QuickCreatePlacesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (params: BulkPlaceCreationParams) => void;
  categories: Category[];
  facilityName: string;
  maxCapacity: number;
  currentPlacesCount: number;
}

const QuickCreatePlacesModal: React.FC<QuickCreatePlacesModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categories,
  facilityName,
  maxCapacity,
  currentPlacesCount,
}) => {
  const { t } = useTranslation();
  
  // Filter categories to only show those with unitType 'places'
  const placeCategories = categories.filter(cat => cat.unitType === 'places');
  
  const [params, setParams] = useState<BulkPlaceCreationParams>({
    categoryId: '',
    count: maxCapacity > currentPlacesCount ? maxCapacity - currentPlacesCount : 1,
    genderSuitability: 'all',
    minAge: 0,
    maxAge: 18,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setParams(prev => ({
      ...prev,
      [name]: name === 'minAge' || name === 'maxAge' || name === 'count' 
        ? parseInt(value) 
        : value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setParams(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRadioChange = (name: string, value: string) => {
    setParams(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!params.categoryId) {
      newErrors.categoryId = t('validation.required');
    }
    
    if (params.count <= 0) {
      newErrors.count = t('validation.positive');
    }
    
    if (params.count > (maxCapacity - currentPlacesCount)) {
      newErrors.count = t('validation.maxCount', { max: maxCapacity - currentPlacesCount });
    }
    
    if (params.minAge < 0) {
      newErrors.minAge = t('validation.minAge');
    }
    
    if (params.maxAge < params.minAge) {
      newErrors.maxAge = t('validation.maxAgeThanMin');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(params);
    }
  };

  const placesToCreate = maxCapacity - currentPlacesCount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={t('place.quickCreate.title')}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-4">
            {t('place.quickCreate.description', {
              facilityName,
              count: placesToCreate,
              currentCount: currentPlacesCount,
              maxCapacity,
            })}
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
                {t('place.category')} *
              </label>
              <Select
                id="categoryId"
                name="categoryId"
                value={params.categoryId}
                onChange={(value) => handleSelectChange('categoryId', value)}
                error={errors.categoryId}
                required
              >
                <option value="">{t('common.select')}</option>
                {placeCategories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label htmlFor="count" className="block text-sm font-medium text-gray-700">
                {t('place.count')} *
              </label>
              <Input
                id="count"
                name="count"
                type="number"
                min={1}
                max={placesToCreate}
                value={params.count}
                onChange={handleChange}
                error={errors.count}
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('place.maxCount', { max: placesToCreate })}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('place.genderSuitability')} *
              </label>
              <RadioGroup
                name="genderSuitability"
                value={params.genderSuitability}
                onChange={(value) => handleRadioChange('genderSuitability', value)}
                options={[
                  { value: 'male', label: t('place.genderSuitability.male') },
                  { value: 'female', label: t('place.genderSuitability.female') },
                  { value: 'all', label: t('place.genderSuitability.all') },
                ]}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="minAge" className="block text-sm font-medium text-gray-700">
                  {t('place.minAge')} *
                </label>
                <Input
                  id="minAge"
                  name="minAge"
                  type="number"
                  min={0}
                  max={params.maxAge}
                  value={params.minAge}
                  onChange={handleChange}
                  error={errors.minAge}
                  required
                />
              </div>
              <div>
                <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700">
                  {t('place.maxAge')} *
                </label>
                <Input
                  id="maxAge"
                  name="maxAge"
                  type="number"
                  min={params.minAge}
                  max={100}
                  value={params.maxAge}
                  onChange={handleChange}
                  error={errors.maxAge}
                  required
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={!params.categoryId || params.count <= 0 || params.count > placesToCreate}
          >
            {t('place.quickCreate.submit')}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default QuickCreatePlacesModal;
