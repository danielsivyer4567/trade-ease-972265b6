import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
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
 * NavLink component - A specialized Link for navigation components
 * that adds active styling and allows natural routing
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
  onClick,
  ...rest
}) => {
  // Use the children as title if not provided
  const linkTitle = title || (typeof children === 'string' ? children : to.split('/').pop() || 'Page');
  
  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors',
        'hover:bg-slate-100 dark:hover:bg-slate-800',
        active && activeClassName,
        className
      )}
      {...rest}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
}; 