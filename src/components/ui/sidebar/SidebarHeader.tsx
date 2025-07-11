import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, MenuIcon, Plus, Building2, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarTheme } from './theme/SidebarThemeContext';
import { useOrganization } from '@/contexts/OrganizationContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

interface SidebarHeaderProps {
  isExpanded: boolean;
  onToggle: () => void;
  className?: string;
}

export function SidebarHeader({ isExpanded, onToggle, className }: SidebarHeaderProps) {
  const { theme } = useSidebarTheme();
  const { 
    currentOrganization, 
    userOrganizations, 
    subscriptionTier, 
    canCreateMoreOrganizations,
    switchOrganization,
    isLoading 
  } = useOrganization();
  
  const handleSwitchOrganization = async (organizationId: string) => {
    await switchOrganization(organizationId);
  };

  const handleCreateNewOrganization = () => {
    // Navigate to organization creation page
    window.location.href = '/settings/organization/new';
  };
  
  return (
    <div className={cn(
      "flex flex-col",
      className
    )}>
      {/* Header with toggle */}
      <div className={cn(
        "flex items-center",
        "bg-gradient-to-r from-[#1e2a3b] to-[#23375d]", 
        "h-12 px-3",
        className
      )}>
        <div className="flex flex-1 items-center justify-center gap-2">
          {/* Always show logo */}
          
          {/* Always show text */}
          <span className="font-bold text-lg text-white whitespace-nowrap">TradeEase</span>
          <img src="/lovable-uploads/147b0371-94bb-403e-a449-f6fc081c4d6c.png" alt="TradeEase Logo" className="h-5 w-auto ml-1" />
        </div>
        <button
          onClick={onToggle}
          className="p-1 rounded-md hover:bg-white/10 transition-colors"
        >
          {isExpanded ? (
            <ChevronLeft className="h-5 w-5 text-white" />
          ) : (
            <MenuIcon className="h-5 w-5 text-white" />
          )}
        </button>
      </div>

      {/* Business Selector - Only show when sidebar is expanded */}
      {isExpanded && (
        <div className="px-2 py-2">
          <div className="relative">
            {isLoading ? (
              <Skeleton className="h-8 w-full" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    className="w-full justify-between bg-white text-gray-800 px-2 py-1.5 h-auto hover:bg-gray-100"
                  >
                    <div className="flex items-center gap-1 min-w-0">
                      <Building2 className="w-4 h-4 text-blue-500 flex-shrink-0" />
                      <span className="text-xs font-medium truncate">
                        {currentOrganization?.name || 'Select Organization'}
                      </span>
                    </div>
                    <ChevronDown className="h-3 w-3 text-gray-500 ml-1 flex-shrink-0" />
                  </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent className="w-56" align="start">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Organizations</span>
                    <Badge variant="outline" className="text-xs">
                      {subscriptionTier === 'skeleton_key' ? 'Skeleton Key' : 
                       subscriptionTier === 'premium_edge' ? 'Premium' : 
                       subscriptionTier === 'growing_pain_relief' ? 'Growing' : 'Free'}
                    </Badge>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* User's own organizations */}
                  {userOrganizations
                    .filter(org => org.access_type === 'member')
                    .map((org) => (
                      <DropdownMenuItem
                        key={org.organization_id}
                        onClick={() => handleSwitchOrganization(org.organization_id)}
                        className="cursor-pointer"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-4 h-4" />
                            <span className="text-sm">{org.organization_name}</span>
                          </div>
                          {org.is_current && (
                            <Badge variant="secondary" className="text-xs">Current</Badge>
                          )}
                        </div>
                      </DropdownMenuItem>
                    ))}
                  
                  {/* Agency client organizations */}
                  {subscriptionTier === 'skeleton_key' && 
                   userOrganizations.filter(org => org.access_type === 'agency').length > 0 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Client Organizations
                      </DropdownMenuLabel>
                      {userOrganizations
                        .filter(org => org.access_type === 'agency')
                        .map((org) => (
                          <DropdownMenuItem
                            key={org.organization_id}
                            onClick={() => handleSwitchOrganization(org.organization_id)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center justify-between w-full">
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                <span className="text-sm">{org.organization_name}</span>
                              </div>
                              {org.is_current && (
                                <Badge variant="secondary" className="text-xs">Current</Badge>
                              )}
                            </div>
                          </DropdownMenuItem>
                        ))}
                    </>
                  )}
                  
                  {/* Add new organization option for premium/skeleton key users */}
                  {(subscriptionTier === 'premium_edge' || subscriptionTier === 'skeleton_key') && 
                   canCreateMoreOrganizations && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleCreateNewOrganization}
                        className="cursor-pointer"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="text-sm">Add Organization</span>
                      </DropdownMenuItem>
                    </>
                  )}
                  
                  {/* Upgrade prompt for free users */}
                  {subscriptionTier === 'free_starter' && !canCreateMoreOrganizations && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => window.location.href = '/settings/subscription'}
                        className="cursor-pointer text-blue-600"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        <span className="text-sm">Upgrade for Multiple Organizations</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          
          {/* Search Bar */}
          <div className="mt-2 relative">
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full bg-white text-gray-800 px-3 py-1.5 pr-16 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
              <span className="text-[10px] text-gray-400">ctrl K</span>
              <button className="bg-green-500 text-white p-0.5 rounded text-xs">
                <Plus className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
