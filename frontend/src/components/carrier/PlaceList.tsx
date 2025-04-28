import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Place } from '../../types/place.types';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';

interface PlaceListProps {
  places: Place[];
  onEdit: (place: Place) => void;
  onDelete: (place: Place) => void;
  onToggleOccupation: (place: Place) => void;
  onChangeGenderSuitability: (place: Place, genderSuitability: 'male' | 'female' | 'all') => void;
}

const PlaceList: React.FC<PlaceListProps> = ({
  places,
  onEdit,
  onDelete,
  onToggleOccupation,
  onChangeGenderSuitability,
}) => {
  const { t } = useTranslation();
  const [expandedPlaceId, setExpandedPlaceId] = useState<string | null>(null);

  const toggleExpand = (placeId: string) => {
    setExpandedPlaceId(expandedPlaceId === placeId ? null : placeId);
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
        return t('place.genderSuitability.male');
      case 'female':
        return t('place.genderSuitability.female');
      case 'all':
      default:
        return t('place.genderSuitability.all');
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {places.map((place) => (
          <li key={place.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <p className="text-sm font-medium text-indigo-600 truncate">{place.name}</p>
                  <Badge
                    variant={place.isOccupied ? 'danger' : 'success'}
                    className="ml-2"
                  >
                    {place.isOccupied ? t('place.occupied') : t('place.available')}
                  </Badge>
                </div>
                <div className="ml-2 flex-shrink-0 flex">
                  <Badge
                    className={`${getGenderSuitabilityColor(place.genderSuitability)}`}
                  >
                    {getGenderSuitabilityLabel(place.genderSuitability)}
                  </Badge>
                </div>
              </div>
              <div className="mt-2 sm:flex sm:justify-between">
                <div className="sm:flex">
                  <p className="flex items-center text-sm text-gray-500">
                    {place.category?.name}
                  </p>
                  <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                    {t('place.ageRange', { min: place.minAge, max: place.maxAge })}
                  </p>
                </div>
                <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <button
                    onClick={() => toggleExpand(place.id)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {expandedPlaceId === place.id ? t('common.collapse') : t('common.expand')}
                  </button>
                </div>
              </div>

              {expandedPlaceId === place.id && (
                <div className="mt-4 border-t border-gray-200 pt-4">
                  {place.notes && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-gray-500">{t('place.notes')}</h4>
                      <p className="mt-1 text-sm text-gray-900">{place.notes}</p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={place.isOccupied ? 'success' : 'danger'}
                      size="sm"
                      onClick={() => onToggleOccupation(place)}
                    >
                      {place.isOccupied ? t('place.markAvailable') : t('place.markOccupied')}
                    </Button>
                    
                    <div className="relative inline-block text-left">
                      <div>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          {t('place.changeGender')}
                        </Button>
                      </div>
                      <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                        <div className="py-1" role="menu" aria-orientation="vertical">
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => onChangeGenderSuitability(place, 'male')}
                          >
                            {t('place.genderSuitability.male')}
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => onChangeGenderSuitability(place, 'female')}
                          >
                            {t('place.genderSuitability.female')}
                          </button>
                          <button
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => onChangeGenderSuitability(place, 'all')}
                          >
                            {t('place.genderSuitability.all')}
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEdit(place)}
                    >
                      {t('common.edit')}
                    </Button>
                    
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onDelete(place)}
                    >
                      {t('common.delete')}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaceList;
