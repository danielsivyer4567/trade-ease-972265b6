import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import { useTabbedLink } from '@/hooks/useTabbedLink';

interface TabLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  title: string;
  tabId?: string;
  children: React.ReactNode;
}

/**
 * TabLink component - Drop-in replacement for regular Link component
 * that maintains the tab breadcrumb feature while allowing direct routing
 */
export const TabLink: React.FC<TabLinkProps> = ({
  to,
  title,
  tabId,
  children,
  onClick,
  ...rest
}) => {
  const { createClickHandler } = useTabbedLink();
  
  // Create a click handler that both opens the tab and navigates directly
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
      
      // If the default was prevented by the original handler, respect that
      if (e.defaultPrevented) {
        return;
      }
    }
    
    // Handle the navigation and tab creation
    createClickHandler(to, title, tabId)(e);
  };

  return (
    <Link
      to={to}
      onClick={handleClick}
      {...rest}
    >
      {children}
    </Link>
  );
};

/**
 * Button variant of TabLink that triggers tabbed navigation on click
 */
interface TabButtonProps {
  to: string;
  title: string;
  tabId?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export const TabButton: React.FC<TabButtonProps> = ({
  to,
  title,
  tabId,
  children,
  className,
  onClick,
  ...rest
}) => {
  const { navigateWithTab } = useTabbedLink();
  
  const handleClick = (e: React.MouseEvent) => {
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
    
    // Handle the navigation and tab creation
    navigateWithTab(to, title, tabId);
  };

  return (
    <button
      onClick={handleClick}
      className={className}
      type="button"
      {...rest}
    >
      {children}
    </button>
  );
}; 