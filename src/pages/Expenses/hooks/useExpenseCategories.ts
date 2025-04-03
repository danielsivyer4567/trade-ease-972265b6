
import { useState } from "react";
import { ExpenseCategory } from "../types";

export function useExpenseCategories() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([
    {
      id: "1",
      name: "Materials",
      description: "Construction materials and supplies",
      budget: 5000,
      icon: "package", 
      isActive: true
    },
    {
      id: "2",
      name: "Labor",
      description: "Staff and contractor wages",
      budget: 10000,
      icon: "users",
      isActive: true
    },
    {
      id: "3",
      name: "Equipment",
      description: "Tools and machinery",
      budget: 3000,
      icon: "tool",
      isActive: true
    },
    {
      id: "4",
      name: "Office",
      description: "Office supplies and expenses",
      budget: 1500,
      icon: "home",
      isActive: true
    },
    {
      id: "5",
      name: "Travel",
      description: "Transportation and mileage",
      budget: 2000,
      icon: "truck",
      isActive: true
    },
    {
      id: "6",
      name: "Other",
      description: "Miscellaneous expenses",
      budget: 1000,
      icon: "more-horizontal",
      isActive: true
    }
  ]);

  // Function to add a new category
  const addCategory = (category: Omit<ExpenseCategory, "id">) => {
    const newCategory = {
      ...category,
      id: Date.now().toString()
    };
    setCategories([...categories, newCategory]);
  };

  // Function to update a category
  const updateCategory = (id: string, updatedCategory: Partial<ExpenseCategory>) => {
    setCategories(
      categories.map(category => 
        category.id === id ? { ...category, ...updatedCategory } : category
      )
    );
  };

  // Function to delete a category
  const deleteCategory = (id: string) => {
    setCategories(categories.filter(category => category.id !== id));
  };

  // Since we're using static data, we're not actually loading from an API
  const isLoading = false;

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    isLoading
  };
}
