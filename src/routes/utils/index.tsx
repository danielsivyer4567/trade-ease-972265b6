import React, { Suspense } from 'react';
import { LoadingFallback } from '../loading-fallback';

export const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<LoadingFallback />}>{children}</Suspense>
); 