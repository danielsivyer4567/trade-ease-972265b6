
import { useState, useCallback } from 'react';

export function usePhotoSharing() {
  const [isPhotoSharingOpen, setIsPhotoSharingOpen] = useState(false);
  const [sharingSource, setSharingSource] = useState<'job' | 'customer' | 'social'>('job');
  const [sharingJobId, setSharingJobId] = useState<string | undefined>(undefined);
  const [sharingCustomerId, setSharingCustomerId] = useState<string | undefined>(undefined);

  const openPhotoSharing = useCallback((source: 'job' | 'customer' | 'social', id?: string) => {
    setSharingSource(source);
    if (source === 'job') {
      setSharingJobId(id);
      setSharingCustomerId(undefined);
    } else if (source === 'customer') {
      setSharingCustomerId(id);
      setSharingJobId(undefined);
    } else {
      setSharingJobId(undefined);
      setSharingCustomerId(undefined);
    }
    setIsPhotoSharingOpen(true);
  }, []);

  const closePhotoSharing = useCallback(() => {
    setIsPhotoSharingOpen(false);
  }, []);

  return {
    isPhotoSharingOpen,
    sharingSource,
    sharingJobId,
    sharingCustomerId,
    openPhotoSharing,
    closePhotoSharing,
  };
}
