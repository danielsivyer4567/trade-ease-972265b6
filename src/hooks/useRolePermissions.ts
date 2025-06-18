import { useMemo } from 'react';
import { UserRole, RolePermissions, rolePermissions } from '../types/roles';

export const useRolePermissions = (userRole: UserRole) => {
  const permissions: RolePermissions = useMemo(() => {
    return rolePermissions[userRole];
  }, [userRole]);

  const hasPermission = (permission: keyof RolePermissions): boolean => {
    return permissions[permission] || false;
  };

  const hasAnyPermission = (permissionsToCheck: Array<keyof RolePermissions>): boolean => {
    return permissionsToCheck.some(permission => hasPermission(permission));
  };

  const hasAllPermissions = (permissionsToCheck: Array<keyof RolePermissions>): boolean => {
    return permissionsToCheck.every(permission => hasPermission(permission));
  };

  return {
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions
  };
}; 