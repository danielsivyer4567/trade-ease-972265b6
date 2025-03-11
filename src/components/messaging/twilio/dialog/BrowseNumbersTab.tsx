
import React from 'react';
import { AreaCodeSearch } from './AreaCodeSearch';
import { NumberList } from './NumberList';
import { TwilioPhoneNumber } from '../types';

interface BrowseNumbersTabProps {
  areaCode: string;
  setAreaCode: (value: string) => void;
  isLoadingNumbers: boolean;
  availableNumbers: TwilioPhoneNumber[];
  phoneNumber: string;
  fetchAvailableNumbers: () => void;
  handleSelectNumber: (number: TwilioPhoneNumber) => void;
}

export const BrowseNumbersTab = ({
  areaCode,
  setAreaCode,
  isLoadingNumbers,
  availableNumbers,
  phoneNumber,
  fetchAvailableNumbers,
  handleSelectNumber
}: BrowseNumbersTabProps) => {
  return (
    <div className="space-y-4 py-4">
      <AreaCodeSearch 
        areaCode={areaCode}
        setAreaCode={setAreaCode}
        isLoadingNumbers={isLoadingNumbers}
        fetchAvailableNumbers={fetchAvailableNumbers}
      />
      
      <NumberList 
        isLoadingNumbers={isLoadingNumbers}
        availableNumbers={availableNumbers}
        phoneNumber={phoneNumber}
        handleSelectNumber={handleSelectNumber}
      />
    </div>
  );
};
