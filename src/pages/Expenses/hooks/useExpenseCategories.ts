
import { useState, useEffect } from 'react';
import { ExpenseCategory } from '../types';

// Mock data for demonstration
const INITIAL_CATEGORIES: ExpenseCategory[] = [
  {
    id: '1',
    name: 'Office Supplies',
    description: 'Paper, ink, pens, and other office materials',
    budget: 500,
    icon: 'Briefcase',
  },
  {
    id: '2',
    name: 'Travel',
    description: 'Business trips, airfare, hotels, and transportation',
    budget: 2000,
    icon: 'Plane',
  },
  {
    id: '3',
    name: 'Meals',
    description: 'Business lunches, dinners, and team events',
    budget: 800,
    icon: 'Coffee',
  },
  {
    id: '4',
    name: 'Equipment',
    description: 'Electronics, hardware, and machinery',
    budget: 5000,
    icon: 'Home',
  },
  {
    id: '5',
    name: 'Software',
    description: 'Software licenses and subscriptions',
    budget: 1200,
    icon: 'Tag',
  },
  {
    id: '6',
    name: 'Training',
    description: 'Courses, workshops, and educational materials',
    budget: 1500,
    icon: 'Users',
  },
];

export const useExpenseCategories = () => {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Simulate API call
    const fetchCategories = async () => {
      try {
        // In a real app, we would fetch data from an API
        await new Promise(resolve => setTimeout(resolve, 800));
        setCategories(INITIAL_CATEGORIES);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  const addCategory = async (categoryData: Omit<ExpenseCategory, 'id'>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newCategory: ExpenseCategory = {
        id: Date.now().toString(),
        ...categoryData,
      };
      
      setCategories(prev => [...prev, newCategory]);
      return newCategory;
    } catch (error) {
      console.error('Error adding category:', error);
      throw error;
    }
  };
  
  const updateCategory = async (categoryData: ExpenseCategory) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCategories(prev =>
        prev.map(cat => (cat.id === categoryData.id ? categoryData : cat))
      );
      
      return categoryData;
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  };
  
  const deleteCategory = async (categoryId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCategories(prev => prev.filter(cat => cat.id !== categoryId));
      return true;
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  };
  
  return {
    categories,
    isLoading,
    addCategory,
    updateCategory,
    deleteCategory,
  };
};
