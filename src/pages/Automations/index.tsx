
import React from 'react';
import { BaseLayout } from '@/components/ui/BaseLayout';
import { ClipboardList } from 'lucide-react';
import { useAutomations } from './hooks/useAutomations';
import { categoryOptions } from './data/categoryOptions';

// Components
import AutomationsHeader from './components/AutomationsHeader';
import CategoryFilter from './components/CategoryFilter';
import CategoryInfoBanner from './components/CategoryInfoBanner';
import AutomationGrid from './components/AutomationGrid';
import ProSubscriptionFooter from './components/ProSubscriptionFooter';

const Automations = () => {
  const {
    selectedCategory,
    setSelectedCategory,
    filteredAutomations,
    toggleAutomation
  } = useAutomations();

  return (
    <BaseLayout>
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        <AutomationsHeader selectedCategory={selectedCategory} />
        
        <CategoryFilter 
          categoryOptions={categoryOptions}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        
        <CategoryInfoBanner category={selectedCategory} />
        
        <AutomationGrid 
          automations={filteredAutomations} 
          toggleAutomation={toggleAutomation} 
        />
        
        <ProSubscriptionFooter />
      </div>
    </BaseLayout>
  );
};

export default Automations;
