
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { Automation } from '../types';
import { automationData } from '../data/automationData';

export const useAutomations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const urlParams = new URLSearchParams(location.search);
  const urlCategory = urlParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState(urlCategory || 'all');
  const [automations, setAutomations] = useState<Automation[]>(automationData);
  
  useEffect(() => {
    if (selectedCategory === 'all') {
      navigate('/automations', { replace: true });
    } else {
      navigate(`/automations?category=${selectedCategory}`, { replace: true });
    }
  }, [selectedCategory, navigate]);
  
  const toggleAutomation = (id: number) => {
    setAutomations(prevAutomations => 
      prevAutomations.map(automation => 
        automation.id === id ? {...automation, isActive: !automation.isActive} : automation
      )
    );
    
    const automation = automations.find(a => a.id === id);
    if (automation) {
      toast.success(
        automation.isActive 
          ? `${automation.title} disabled` 
          : `${automation.title} enabled`
      );
    }
  };

  const filteredAutomations = selectedCategory === 'all' 
    ? automations 
    : automations.filter(automation => automation.category === selectedCategory);

  return {
    selectedCategory,
    setSelectedCategory,
    automations,
    filteredAutomations,
    toggleAutomation
  };
};
