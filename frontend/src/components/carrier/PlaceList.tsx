import React from 'react';
import { useTranslation } from 'react-i18next';
import { Place } from '../../services/placeService';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Switch } from '../ui/Switch';

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
  const { t } = useTranslation(['translation', 'place']);

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
        return t('place:genderSuitability.male');
      case 'female':
        return t('place:genderSuitability.female');
      case 'all':
      default:
        return t('place:genderSuitability.all');
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('place:name')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('place:category')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('place:genderSuitability.title')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('place:ageRangeTitle')}
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('place:status')}
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t('common.actions')}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {places.map((place) => (
            <tr key={place.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{place.name}</div>
                {place.notes && (
                  <div className="text-sm text-gray-500 truncate max-w-xs" title={place.notes}>
                    {place.notes}
                  </div>
                )}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{place.category?.name || ''}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Badge className={`${getGenderSuitabilityColor(place.genderSuitability)}`}>
                  {getGenderSuitabilityLabel(place.genderSuitability)}
                </Badge>
                <Button
                  variant="text"
                  size="xs"
                  className="ml-2"
                  onClick={() => {
                    const newGenderSuitability =
                      place.genderSuitability === 'male' ? 'female' :
                      place.genderSuitability === 'female' ? 'all' : 'male';
                    onChangeGenderSuitability(place, newGenderSuitability);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </Button>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {t('place:ageRange', { min: place.minAge, max: place.maxAge })}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <Switch
                  checked={!place.isOccupied}
                  onChange={() => onToggleOccupation(place)}
                  label={place.isOccupied ? t('place:occupied') : t('place:available')}
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <Button
                  variant="outline"
                  size="xs"
                  className="mr-2"
                  onClick={() => onEdit(place)}
                >
                  {t('common.edit')}
                </Button>
                <Button
                  variant="danger"
                  size="xs"
                  onClick={() => onDelete(place)}
                >
                  {t('common.delete')}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PlaceList;
