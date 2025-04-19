import { actionsNavigation } from './navigation-actions';
import { businessNavigation } from './navigation-business';
import { networksNavigation } from './navigation-networks';
import { overviewNavigation } from './navigation-overview';
import { supplyChainNavigation } from './navigation-supply-chain';
import { technicalNavigation } from './navigation-technical';
import { complianceNavigation } from './navigation-compliance';
import { teamLinks, calendarTeamLinks } from './team-links';
import { SIDEBAR_CONSTANTS } from './sidebar-config';
import { NavigationItem } from '../navigation/NavigationGroup';

// Define the structure for navigation groups
export type NavigationGroup = {
  label?: string;
  items: NavigationItem[];
};

// Export all navigation groups
export const navigationGroups: NavigationGroup[] = [
  overviewNavigation,
  businessNavigation,
  technicalNavigation,
  complianceNavigation,
  networksNavigation,
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
  complianceNavigation,
  networksNavigation,
  supplyChainNavigation,
  actionsNavigation
};
