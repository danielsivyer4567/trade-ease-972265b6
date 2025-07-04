import React from 'react';
import { QBCCVoiceSearch } from '@/components/QBCCVoiceSearch';

export default function QBCCVoiceSearchPage() {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">QBCC Forms Voice Search</h1>
        <p className="text-gray-600">
          Test the voice search functionality for Queensland Building and Construction Commission forms.
        </p>
      </div>
      <QBCCVoiceSearch />
    </div>
  );
} 