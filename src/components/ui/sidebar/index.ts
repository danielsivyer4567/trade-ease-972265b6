
// Export all sidebar components from this index file
export * from "./Sidebar";
export * from "./SidebarHeader";
export * from "./SidebarFooter";
export * from "./SidebarSeparator";
export * from "./SidebarMenu";
export * from "./SidebarMenuSub";
export * from "./types";
export * from "./SidebarNavLinks";
export * from "./SidebarTeamSection";
export * from "./SidebarContent";
export * from "./SidebarProvider";

// Export NavigationGroup component but not the type from constants with same name
export { NavigationGroup } from "./navigation/NavigationGroup";

// Export constants separately with explicit naming to avoid conflicts
export { 
  teamLinks,
  calendarTeamLinks,
  SIDEBAR_CONSTANTS,
  overviewNavigation,
  businessNavigation,
  technicalNavigation,
  communicationNavigation,
  supplyChainNavigation,
  actionsNavigation,
  navigationGroups
} from "./constants";

// Export the NavigationGroup type with a more specific name to avoid conflicts
export type { NavigationGroup as SidebarNavigationGroup } from "./constants";
