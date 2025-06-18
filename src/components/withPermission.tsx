import React from 'react';
import { UserRole, RolePermissions } from '../types/roles';
import { useRolePermissions } from '../hooks/useRolePermissions';

interface WithPermissionProps {
  userRole: UserRole;
  requiredPermissions: Array<keyof RolePermissions>;
  requireAll?: boolean;
  fallback?: React.ReactNode;
}

export const withPermission = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  return ({
    userRole,
    requiredPermissions,
    requireAll = true,
    fallback = null,
    ...props
  }: WithPermissionProps & P) => {
    const { hasAllPermissions, hasAnyPermission } = useRolePermissions(userRole);

    const hasRequiredPermissions = requireAll
      ? hasAllPermissions(requiredPermissions)
      : hasAnyPermission(requiredPermissions);

    if (!hasRequiredPermissions) {
      return <>{fallback}</>;
    }

    return <WrappedComponent {...(props as P)} />;
  };
}; 