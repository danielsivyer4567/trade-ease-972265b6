
export * from './sidebar-config';
export * from './team-links';
export * from './navigation-overview';
export * from './navigation-business';
export * from './navigation-supply-chain';
export * from './navigation-communication';
export * from './navigation-technical';
export * from './navigation-actions';

// Combine all navigation groups into one array for easy access
import { overviewNavigation } from './navigation-overview';
import { businessNavigation } from './navigation-business';
import { supplyChainNavigation } from './navigation-supply-chain';
import { communicationNavigation } from './navigation-communication';
import { technicalNavigation } from './navigation-technical';
import { actionsNavigation } from './navigation-actions';

export const navigationGroups = [
  overviewNavigation,
  businessNavigation,
  supplyChainNavigation,
  communicationNavigation,
  technicalNavigation,
  actionsNavigation,
];
