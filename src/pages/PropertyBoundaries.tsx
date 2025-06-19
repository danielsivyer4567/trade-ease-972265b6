import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/ui/AppLayout';
import { Button } from '@/components/ui/button';
import { MapPin, Upload, Download, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useBoundaryProcessing } from '@/components/property-map/hooks/useBoundaryProcessing';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'


const PropertyBoundaries: React.FC = () => {


  const [showMeasurements, setShowMeasurements] = useState(true);
  const [ParcelMap, setParcelMap] = useState<React.FC | null>(null);


  useEffect(() => {
    import('@/components/parcel/parcel').then((mod) => {
      setParcelMap(() => mod.default);
    });
  }, []);

  

  const toggleMeasurements = () => {
    setShowMeasurements(!showMeasurements);
  };

  return (
    <AppLayout><div className="w-full h-screen relative">
    {ParcelMap ? <ParcelMap showMeasurements={showMeasurements} /> : <p>Loading map...</p>}
  </div>
  </AppLayout>
  


);
};
export default PropertyBoundaries;