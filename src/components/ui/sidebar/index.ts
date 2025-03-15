
// Export all sidebar components from this index file
export * from "./SidebarHeader";
export * from "./SidebarFooter";
export * from "./SidebarSeparator";
export * from "./SidebarMenu";
export * from "./SidebarMenuSub";
export * from "./constants";
export * from "./types";
export * from "./SidebarNavLinks";
export * from "./SidebarTeamSection";

// Add a simple useSidebar hook for backwards compatibility
export function useSidebar() {
  return {
    state: "expanded", // Default state
    isCollapsed: false
  };
}
