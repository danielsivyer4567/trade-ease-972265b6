import { useState, useCallback } from 'react';

export function usePhotoSharing() {
  const [isPhotoSharingOpen, setIsPhotoSharingOpen] = useState(false);
  const [sharingSource, setSharingSource] = useState<'job' | 'customer' | null>(null);
  const [entityId, setEntityId] = useState<string | null>(null);

  const openPhotoSharing = useCallback((source: 'job' | 'customer', id: string) => {
    setSharingSource(source);
    setEntityId(id);
    setIsPhotoSharingOpen(true);
  }, []);

  const closePhotoSharing = useCallback(() => {
    setIsPhotoSharingOpen(false);
    // Keep the source and ID for a moment in case we need to reopen
    setTimeout(() => {
      setSharingSource(null);
      setEntityId(null);
    }, 300);
  }, []);

  return {
    isPhotoSharingOpen,
    sharingSource,
    entityId,
    openPhotoSharing,
    closePhotoSharing
  };
}
