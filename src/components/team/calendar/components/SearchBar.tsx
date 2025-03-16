
import React, { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { DateTimeSelectors } from './search/DateTimeSelectors';
import { JobSearch } from './search/JobSearch';
import { StaffConnections } from './search/StaffConnections';
import { NotesSection } from './search/NotesSection';

interface SearchBarProps {
  jobSearchQuery: string;
  setJobSearchQuery: (value: string) => void;
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  startTime: string;
  setStartTime: (time: string) => void;
  endTime: string;
  setEndTime: (time: string) => void;
  onToggleQuoteSearch: () => void;
  onCreateJob: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  jobSearchQuery,
  setJobSearchQuery,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  onToggleQuoteSearch,
  onCreateJob
}) => {
  const isMobile = useIsMobile();

  return (
    <div className={`w-full ${isMobile ? 'py-0.5 px-1' : 'py-1 px-2'}`}>
      <div className="grid grid-cols-1 gap-1 my-0 px-0">
        {/* Combined Date and Time row */}
        <DateTimeSelectors
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
          startTime={startTime}
          setStartTime={setStartTime}
          endTime={endTime}
          setEndTime={setEndTime}
        />
        
        {/* Job section */}
        <JobSearch 
          jobSearchQuery={jobSearchQuery}
          setJobSearchQuery={setJobSearchQuery}
          startDate={startDate}
          startTime={startTime}
          endDate={endDate}
          endTime={endTime}
        />
        
        {/* Staff & Connections section */}
        <StaffConnections />
        
        {/* Notes section - The last section */}
        <NotesSection />
      </div>
    </div>
  );
};
