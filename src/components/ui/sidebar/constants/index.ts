
import { actionsNavigation } from './navigation-actions';
import { businessNavigation } from './navigation-business';
import { communicationNavigation } from './navigation-communication';
import { overviewNavigation } from './navigation-overview';
import { supplyChainNavigation } from './navigation-supply-chain';
import { technicalNavigation } from './navigation-technical';
import { teamLinks, calendarTeamLinks } from './team-links';
import { SIDEBAR_CONSTANTS } from './sidebar-config';

// Export all navigation groups
export const navigationGroups = [
  overviewNavigation,
  businessNavigation,
  technicalNavigation,
  communicationNavigation,
  supplyChainNavigation,
  actionsNavigation
];

// Export all constants
export {
  teamLinks,
  calendarTeamLinks,
  SIDEBAR_CONSTANTS,
  overviewNavigation,
  businessNavigation,
  technicalNavigation,
  communicationNavigation,
  supplyChainNavigation,
  actionsNavigation
};
