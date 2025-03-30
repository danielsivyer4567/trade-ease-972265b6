
import React from 'react';
import { Button } from '@/components/ui/button';
import { CategoryOption } from '../types';

interface CategoryFilterProps {
  categoryOptions: CategoryOption[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

const CategoryFilter = ({ categoryOptions, selectedCategory, setSelectedCategory }: CategoryFilterProps) => {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-2">
        {categoryOptions.map((category) => (
          <Button 
            key={category.value}
            variant={selectedCategory === category.value ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category.value)}
            className="flex items-center gap-1 whitespace-nowrap"
          >
            {category.icon}
            <span>{category.label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
