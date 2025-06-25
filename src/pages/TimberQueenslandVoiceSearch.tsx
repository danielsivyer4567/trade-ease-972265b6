import React from 'react';
import { TimberQueenslandVoiceSearch } from '@/components/TimberQueenslandVoiceSearch';

export default function TimberQueenslandVoiceSearchPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Timber Queensland Voice Search</h1>
        <p className="text-gray-600">
          Test the voice search functionality for Timber Queensland technical data sheets.
        </p>
      </div>
      <TimberQueenslandVoiceSearch />
    </div>
  );
} 