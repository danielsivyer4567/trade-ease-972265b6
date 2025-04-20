import React from 'react';
import { Link, LinkProps, useNavigate } from 'react-router-dom';
import { useTabNavigation } from '@/hooks/useTabNavigation';

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
  const navigate = useNavigate();
  const { openInTab } = useTabNavigation();
  
  // Create a simplified click handler that directly navigates and handles tabs
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
      
      // If the default was prevented by the original handler, respect that
      if (e.defaultPrevented) {
        return;
      }
    }
    
    // Prevent default link behavior
    e.preventDefault();
    
    // First navigate to the path
    navigate(to);
    
    // Then handle tab creation (but don't let errors prevent navigation)
    try {
      openInTab(to, title, tabId);
    } catch (error) {
      console.error('Tab creation failed, but navigation completed:', error);
    }
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
  const navigate = useNavigate();
  const { openInTab } = useTabNavigation();
  
  const handleClick = (e: React.MouseEvent) => {
    // Call the original onClick handler if provided
    if (onClick) {
      onClick(e);
    }
    
    // First navigate to the path
    navigate(to);
    
    // Then handle tab creation (but don't let errors prevent navigation)
    try {
      openInTab(to, title, tabId);
    } catch (error) {
      console.error('Tab creation failed, but navigation completed:', error);
    }
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