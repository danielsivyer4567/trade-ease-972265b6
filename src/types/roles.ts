export enum UserRole {
  SITE_STAFF = 'SITE_STAFF',
  TEAM_LEADER = 'TEAM_LEADER',
  ADMIN_STAFF = 'ADMIN_STAFF',
  DIRECTOR = 'DIRECTOR'
}

export interface RolePermissions {
  canViewPhoneMenu: boolean;
  canViewJobs: boolean;
  canViewCalendar: boolean;
  canModifyCalendar: boolean;
  canViewJobInfo: boolean;
  canViewMultipleTeams: boolean;
  canUploadPictures: boolean;
  canUseTagging: boolean;
  canUseNotifications: boolean;
  canUseCommunication: boolean;
  canMoveJobs: boolean;
  canViewCustomerDetails: boolean;
  canModifyStaffAssignments: boolean;
  canDeleteStaff: boolean;
  canModifyStaffPermissions: boolean;
  hasFullAccess: boolean;
}

export const rolePermissions: Record<UserRole, RolePermissions> = {
  [UserRole.SITE_STAFF]: {
    canViewPhoneMenu: true,
    canViewJobs: true,
    canViewCalendar: true,
    canModifyCalendar: false,
    canViewJobInfo: true,
    canViewMultipleTeams: false,
    canUploadPictures: true,
    canUseTagging: true,
    canUseNotifications: true,
    canUseCommunication: true,
    canMoveJobs: false,
    canViewCustomerDetails: false,
    canModifyStaffAssignments: false,
    canDeleteStaff: false,
    canModifyStaffPermissions: false,
    hasFullAccess: false
  },
  [UserRole.TEAM_LEADER]: {
    canViewPhoneMenu: true,
    canViewJobs: true,
    canViewCalendar: true,
    canModifyCalendar: true,
    canViewJobInfo: true,
    canViewMultipleTeams: true,
    canUploadPictures: true,
    canUseTagging: true,
    canUseNotifications: true,
    canUseCommunication: true,
    canMoveJobs: true,
    canViewCustomerDetails: true,
    canModifyStaffAssignments: true,
    canDeleteStaff: false,
    canModifyStaffPermissions: false,
    hasFullAccess: false
  },
  [UserRole.ADMIN_STAFF]: {
    canViewPhoneMenu: true,
    canViewJobs: true,
    canViewCalendar: true,
    canModifyCalendar: true,
    canViewJobInfo: true,
    canViewMultipleTeams: true,
    canUploadPictures: true,
    canUseTagging: true,
    canUseNotifications: true,
    canUseCommunication: true,
    canMoveJobs: true,
    canViewCustomerDetails: true,
    canModifyStaffAssignments: true,
    canDeleteStaff: false,
    canModifyStaffPermissions: false,
    hasFullAccess: false
  },
  [UserRole.DIRECTOR]: {
    canViewPhoneMenu: true,
    canViewJobs: true,
    canViewCalendar: true,
    canModifyCalendar: true,
    canViewJobInfo: true,
    canViewMultipleTeams: true,
    canUploadPictures: true,
    canUseTagging: true,
    canUseNotifications: true,
    canUseCommunication: true,
    canMoveJobs: true,
    canViewCustomerDetails: true,
    canModifyStaffAssignments: true,
    canDeleteStaff: true,
    canModifyStaffPermissions: true,
    hasFullAccess: true
  }
}; 