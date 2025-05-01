import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Hour } from '../../services/hourService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Input } from '../ui/Input';

interface HourListProps {
  hours: Hour[];
  onEdit: (hour: Hour) => void;
  onDelete: (hour: Hour) => void;
  onUpdateAvailableHours: (hour: Hour, availableHours: number) => void;
  onChangeGenderSuitability: (hour: Hour, genderSuitability: 'male' | 'female' | 'all') => void;
}

const HourList: React.FC<HourListProps> = ({
  hours,
  onEdit,
  onDelete,
  onUpdateAvailableHours,
  onChangeGenderSuitability,
}) => {
  const { t } = useTranslation();
  const [expandedHourId, setExpandedHourId] = useState<string | null>(null);
  const [availableHoursInput, setAvailableHoursInput] = useState<Record<string, number>>({});

  const toggleExpand = (hourId: string) => {
    setExpandedHourId(expandedHourId === hourId ? null : hourId);
  };

  const getGenderSuitabilityColor = (genderSuitability: string) => {
    switch (genderSuitability) {
      case 'male':
        return 'bg-blue-100 text-blue-800';
      case 'female':
        return 'bg-pink-100 text-pink-800';
      case 'all':
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  const getGenderSuitabilityLabel = (genderSuitability: string) => {
    switch (genderSuitability) {
      case 'male':
        return t('hour.genderSuitability.male');
      case 'female':
        return t('hour.genderSuitability.female');
      case 'all':
      default:
        return t('hour.genderSuitability.all');
    }
  };

  const getAvailabilityPercentage = (hour: Hour) => {
    return hour.totalHours > 0 
      ? Math.round((hour.availableHours / hour.totalHours) * 100) 
      : 0;
  };

  const getAvailabilityColor = (percentage: number) => {
    if (percentage <= 25) return 'bg-red-100 text-red-800';
    if (percentage <= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const handleAvailableHoursChange = (hourId: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue) && numValue >= 0) {
      setAvailableHoursInput({
        ...availableHoursInput,
        [hourId]: numValue,
      });
    }
  };

  const handleUpdateAvailableHours = (hour: Hour) => {
    const newAvailableHours = availableHoursInput[hour.id];
    if (newAvailableHours !== undefined && newAvailableHours !== hour.availableHours) {
      onUpdateAvailableHours(hour, newAvailableHours);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {hours.map((hour) => {
          const availabilityPercentage = getAvailabilityPercentage(hour);
          
          return (
            <li key={hour.id}>
              <div className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <p className="text-sm font-medium text-indigo-600 truncate">{hour.name}</p>
                    <Badge
                      className={`ml-2 ${getAvailabilityColor(availabilityPercentage)}`}
                    >
                      {t('hour.availability', { 
                        available: hour.availableHours, 
                        total: hour.totalHours,
                        percentage: availabilityPercentage
                      })}
                    </Badge>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <Badge
                      className={`${getGenderSuitabilityColor(hour.genderSuitability)}`}
                    >
                      {getGenderSuitabilityLabel(hour.genderSuitability)}
                    </Badge>
                  </div>
                </div>
                <div className="mt-2 sm:flex sm:justify-between">
                  <div className="sm:flex">
                    <p className="flex items-center text-sm text-gray-500">
                      {hour.category?.name || ''}
                    </p>
                    <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                      {t('hour.ageRange', { min: hour.minAge, max: hour.maxAge })}
                    </p>
                  </div>
                  <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                    <button
                      type="button"
                      className="text-indigo-600 hover:text-indigo-900"
                      onClick={() => toggleExpand(hour.id)}
                    >
                      {expandedHourId === hour.id ? t('common.collapse') : t('common.expand')}
                    </button>
                  </div>
                </div>

                {expandedHourId === hour.id && (
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    {hour.notes && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-500">{t('hour.notes')}</h4>
                        <p className="mt-1 text-sm text-gray-900">{hour.notes}</p>
                      </div>
                    )}
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500">{t('hour.updateAvailableHours')}</h4>
                      <div className="mt-1 flex items-center space-x-2">
                        <Input
                          type="number"
                          min={0}
                          max={hour.totalHours}
                          value={availableHoursInput[hour.id] !== undefined 
                            ? availableHoursInput[hour.id] 
                            : hour.availableHours}
                          onChange={(e) => handleAvailableHoursChange(hour.id, e.target.value)}
                          className="w-24"
                        />
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleUpdateAvailableHours(hour)}
                          disabled={availableHoursInput[hour.id] === undefined || 
                                   availableHoursInput[hour.id] === hour.availableHours}
                        >
                          {t('hour.update')}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="relative inline-block text-left">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newGenderSuitability = 
                              hour.genderSuitability === 'male' ? 'female' :
                              hour.genderSuitability === 'female' ? 'all' : 'male';
                            onChangeGenderSuitability(hour, newGenderSuitability);
                          }}
                        >
                          {t('hour.changeGender')}
                        </Button>
                      </div>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(hour)}
                      >
                        {t('common.edit')}
                      </Button>
                      
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => onDelete(hour)}
                      >
                        {t('common.delete')}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default HourList;
