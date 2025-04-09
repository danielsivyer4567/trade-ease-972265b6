
import React from 'react';
import { useTabs, Tab } from '@/contexts/TabsContext';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export function TabBar() {
  const { tabs, activeTabId, activateTab, removeTab, addTab } = useTabs();

  if (tabs.length === 0) {
    return null;
  }

  const handleTabClick = (tabId: string) => {
    activateTab(tabId);
  };

  const handleTabClose = (e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    removeTab(tabId);
  };

  return (
    <div className="flex overflow-x-auto bg-white border-b border-gray-200 shadow-sm h-10">
      {tabs.map((tab) => (
        <TabItem
          key={tab.id}
          tab={tab}
          isActive={tab.id === activeTabId}
          onClick={() => handleTabClick(tab.id)}
          onClose={(e) => handleTabClose(e, tab.id)}
        />
      ))}
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-10 w-10 flex-shrink-0 text-gray-500 hover:text-gray-700 hover:bg-gray-100" 
        onClick={() => addTab({ title: "New Tab", path: "/" })}
        aria-label="New tab"
      >
        <Plus size={16} />
      </Button>
    </div>
  );
}

interface TabItemProps {
  tab: Tab;
  isActive: boolean;
  onClick: () => void;
  onClose: (e: React.MouseEvent) => void;
}

function TabItem({ tab, isActive, onClick, onClose }: TabItemProps) {
  return (
    <div
      className={cn(
        "flex items-center h-10 px-4 py-2 border-r border-gray-200 cursor-pointer select-none whitespace-nowrap transition-colors min-w-[120px] max-w-[200px]",
        isActive 
          ? "bg-blue-50 border-b-2 border-b-blue-500" 
          : "hover:bg-gray-50"
      )}
      onClick={onClick}
    >
      {tab.icon && <span className="mr-2">{tab.icon}</span>}
      <span className="mr-2 truncate flex-1">{tab.title}</span>
      <button
        className="p-1 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100"
        onClick={onClose}
        aria-label={`Close ${tab.title} tab`}
      >
        <X size={14} />
      </button>
    </div>
  );
}
