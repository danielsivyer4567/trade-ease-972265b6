import React from 'react';
import { LinkProps } from 'react-router-dom';
import { TabLink } from '@/components/ui/TabLink';
import { cn } from '@/lib/utils';

interface NavLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  title?: string;
  active?: boolean;
  icon?: React.ReactNode;
  tabId?: string;
  children: React.ReactNode;
  activeClassName?: string;
}

/**
 * NavLink component - A specialized TabLink for navigation components
 * that adds active styling and default behavior for sidebar navigation
 */
export const NavLink: React.FC<NavLinkProps> = ({
  to,
  title,
  active,
  icon,
  tabId,
  children,
  className,
  activeClassName = 'bg-primary/10 text-primary font-medium',
  ...rest
}) => {
  // Use the children as title if not provided
  const linkTitle = title || (typeof children === 'string' ? children : to.split('/').pop() || 'Page');
  
  return (
    <TabLink
      to={to}
      title={linkTitle}
      tabId={tabId}
      className={cn(
        'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
        'hover:bg-slate-100 dark:hover:bg-slate-800',
        active && activeClassName,
        className
      )}
      {...rest}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </TabLink>
  );
}; 