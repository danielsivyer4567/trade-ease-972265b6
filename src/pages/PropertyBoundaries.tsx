import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';

const PropertyBoundaries: React.FC = () => {
  const [ParcelMap, setParcelMap] = useState<React.FC | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadParcelMap = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const mod = await import('@/components/parcel/parcel');
        setParcelMap(() => mod.default);
      } catch (err) {
        console.error('Failed to load parcel map component:', err);
        setError('Failed to load the map component. Please refresh the page.');
      } finally {
        setIsLoading(false);
      }
    };

    loadParcelMap();
  }, []);

  return (
    <AppLayout>
      <div className="w-full h-screen relative">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading map...</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Refresh Page
              </button>
            </div>
          </div>
        )}
        
        {ParcelMap && !isLoading && !error && <ParcelMap />}
      </div>
    </AppLayout>
  );
};

export default PropertyBoundaries;