import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hour } from '../../services/hourService';
import { Category } from '../../types/carrier.types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { TextArea } from '../ui/TextArea';
import { Select } from '../ui/Select';
import { RadioGroup } from '../ui/RadioGroup';

interface HourFormProps {
  hour?: Partial<Hour>;
  categories: Category[];
  facilityId: string;
  onSubmit: (hour: Partial<Hour>) => void;
  onCancel: () => void;
}

const HourForm: React.FC<HourFormProps> = ({
  hour,
  categories,
  facilityId,
  onSubmit,
  onCancel,
}) => {
  const { t } = useTranslation();
  const isEditing = !!hour?.id;

  // Filter categories to only show those with unitType 'hours'
  const hourCategories = categories.filter(cat => cat.unitType === 'hours');

  const [formData, setFormData] = useState<Partial<Hour>>({
    facilityId,
    categoryId: '',
    name: '',
    totalHours: 40,
    availableHours: 40,
    genderSuitability: 'all',
    minAge: 0,
    maxAge: 27,
    notes: '',
    ...hour,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'minAge' || name === 'maxAge' || name === 'totalHours' || name === 'availableHours' 
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
    setFormData(prev => ({
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
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name) {
      newErrors.name = t('validation.required');
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = t('validation.required');
    }
    
    if (formData.totalHours === undefined || formData.totalHours <= 0) {
      newErrors.totalHours = t('validation.positive');
    }
    
    if (formData.availableHours === undefined || formData.availableHours < 0) {
      newErrors.availableHours = t('validation.nonNegative');
    }
    
    if (formData.availableHours !== undefined && 
        formData.totalHours !== undefined && 
        formData.availableHours > formData.totalHours) {
      newErrors.availableHours = t('validation.availableLessThanTotal');
    }
    
    if (formData.minAge === undefined || formData.minAge < 0) {
      newErrors.minAge = t('validation.minAge');
    }
    
    if (formData.maxAge === undefined || formData.maxAge < formData.minAge!) {
      newErrors.maxAge = t('validation.maxAgeThanMin');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          {t('hour.name')} *
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
          {t('hour.category')} *
        </label>
        <Select
          id="categoryId"
          name="categoryId"
          value={formData.categoryId}
          onChange={(value) => handleSelectChange('categoryId', value)}
          error={errors.categoryId}
          required
        >
          <option value="">{t('common.select')}</option>
          {hourCategories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="totalHours" className="block text-sm font-medium text-gray-700">
            {t('hour.totalHours')} *
          </label>
          <Input
            id="totalHours"
            name="totalHours"
            type="number"
            min={1}
            value={formData.totalHours}
            onChange={handleChange}
            error={errors.totalHours}
            required
          />
        </div>
        <div>
          <label htmlFor="availableHours" className="block text-sm font-medium text-gray-700">
            {t('hour.availableHours')} *
          </label>
          <Input
            id="availableHours"
            name="availableHours"
            type="number"
            min={0}
            max={formData.totalHours}
            value={formData.availableHours}
            onChange={handleChange}
            error={errors.availableHours}
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('hour.genderSuitability')} *
        </label>
        <RadioGroup
          name="genderSuitability"
          value={formData.genderSuitability}
          onChange={(value) => handleRadioChange('genderSuitability', value)}
          options={[
            { value: 'male', label: t('hour.genderSuitability.male') },
            { value: 'female', label: t('hour.genderSuitability.female') },
            { value: 'all', label: t('hour.genderSuitability.all') },
          ]}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="minAge" className="block text-sm font-medium text-gray-700">
            {t('hour.minAge')} *
          </label>
          <Input
            id="minAge"
            name="minAge"
            type="number"
            min={0}
            max={formData.maxAge}
            value={formData.minAge}
            onChange={handleChange}
            error={errors.minAge}
            required
          />
        </div>
        <div>
          <label htmlFor="maxAge" className="block text-sm font-medium text-gray-700">
            {t('hour.maxAge')} *
          </label>
          <Input
            id="maxAge"
            name="maxAge"
            type="number"
            min={formData.minAge}
            max={100}
            value={formData.maxAge}
            onChange={handleChange}
            error={errors.maxAge}
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
          {t('hour.notes')}
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
        >
          {isEditing ? t('common.save') : t('common.create')}
        </Button>
      </div>
    </form>
  );
};

export default HourForm;
