
import React from 'react';
import { BaseLayout } from './BaseLayout';

interface AppLayoutProps {
  children: React.ReactNode;
  className?: string;
  showQuickTabs?: boolean;
}

// AppLayout is just an alias to BaseLayout for backwards compatibility
export function AppLayout({
  children,
  className,
  showQuickTabs = false
}: AppLayoutProps) {
  return (
    <BaseLayout 
      className={className}
      showQuickTabs={showQuickTabs}
    >
      {children}
    </BaseLayout>
  );
}
