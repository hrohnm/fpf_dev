import React from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionItem } from '../ui/Accordion';
import { Spinner } from '../ui/Spinner';
import { Button } from '../ui/Button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';
import PlaceList from './PlaceList';
import HourList from './HourList';
import { Place } from '../../services/placeService';
import { Hour } from '../../services/hourService';

interface FacilityData {
  id: string;
  name: string;
  maxCapacity: number;
  places?: Place[];
  hours?: Hour[];
  isLoadingPlaces?: boolean;
  isLoadingHours?: boolean;
}

interface FacilityAccordionProps {
  facilities: FacilityData[];
  onAccordionToggle: (facilityId: string, isOpen: boolean) => void;
  onCreatePlace: (facilityId: string) => void;
  onCreateHour: (facilityId: string) => void;
  onEditPlace: (place: Place) => void;
  onDeletePlace: (place: Place) => void;
  onTogglePlaceOccupation: (place: Place) => void;
  onChangePlaceGenderSuitability: (place: Place, genderSuitability: 'male' | 'female' | 'all') => void;
  onEditHour: (hour: Hour) => void;
  onDeleteHour: (hour: Hour) => void;
  onUpdateAvailableHours: (hour: Hour, availableHours: number) => void;
  onChangeHourGenderSuitability: (hour: Hour, genderSuitability: 'male' | 'female' | 'all') => void;
  onQuickCreatePlaces: (facilityId: string) => void;
}

const FacilityAccordion: React.FC<FacilityAccordionProps> = ({
  facilities,
  onAccordionToggle,
  onCreatePlace,
  onCreateHour,
  onEditPlace,
  onDeletePlace,
  onTogglePlaceOccupation,
  onChangePlaceGenderSuitability,
  onEditHour,
  onDeleteHour,
  onUpdateAvailableHours,
  onChangeHourGenderSuitability,
  onQuickCreatePlaces,
}) => {
  const { t } = useTranslation(['translation', 'availability', 'place']);

  return (
    <Accordion className="mb-6">
      {facilities.map((facility, index) => {
        const totalPlaces = facility.places?.length || 0;
        const canAddMorePlaces = facility.maxCapacity > totalPlaces;

        return (
          <AccordionItem
            key={facility.id}
            defaultOpen={index === 0} // Open the first facility by default
            title={facility.name}
            badge={
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-4">
                  {t('availability:currentOccupancy', {
                    current: totalPlaces,
                    total: facility.maxCapacity || 0,
                  })}
                </span>
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      onQuickCreatePlaces(facility.id);
                    }}
                    disabled={!canAddMorePlaces}
                  >
                    {t('place:quickCreate.button')}
                  </Button>
                </div>
              </div>
            }
            onToggle={(isOpen) => onAccordionToggle(facility.id, isOpen)}
          >
            {/* Removed Tabs to focus only on Places */}
            <div className="w-full">
              {facility.isLoadingPlaces ? (
                <div className="flex justify-center items-center py-8">
                  <Spinner size="md" />
                </div>
              ) : !facility.places || facility.places.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">
                    {t('place:noPlaces')}
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => onCreatePlace(facility.id)}
                    disabled={!canAddMorePlaces}
                  >
                    {t('place:addPlace')}
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="flex justify-end mb-4">
                    <Button
                      onClick={() => onCreatePlace(facility.id)}
                      disabled={!canAddMorePlaces}
                    >
                      {t('place:addPlace')}
                    </Button>
                  </div>
                  <PlaceList
                    places={facility.places}
                    onEdit={onEditPlace}
                    onDelete={onDeletePlace}
                    onToggleOccupation={onTogglePlaceOccupation}
                    onChangeGenderSuitability={onChangePlaceGenderSuitability}
                  />
                </div>
              )}
            </div>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default FacilityAccordion;
