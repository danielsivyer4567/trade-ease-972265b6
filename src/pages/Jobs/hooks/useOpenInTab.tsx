
import { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useTabs } from '@/contexts/TabsContext';

export function useOpenInTab<T extends { id: string; name?: string; title?: string; jobNumber?: string }>(
  entity: T | null,
  path: string,
  loading: boolean
) {
  const { id } = useParams<{ id: string }>();
  const { addTab } = useTabs();
  const location = useLocation();

  useEffect(() => {
    if (loading || !entity || !id) return;

    // Get the display name (either name, title, or jobNumber property)
    const displayName = entity.name || entity.title || entity.jobNumber || `Item ${entity.id}`;

    // Add this entity as a tab
    addTab({
      id: entity.id,
      title: displayName,
      path: `${path}/${entity.id}${location.search || ''}`
    });
  }, [entity, id, loading, addTab, path, location.search]);

  return null;
}
