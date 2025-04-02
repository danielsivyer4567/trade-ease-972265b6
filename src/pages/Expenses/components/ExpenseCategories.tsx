
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, Pencil, Trash2, Clock, Tag, Wallet, Home, Car, 
  ShoppingCart, Coffee, Briefcase, Users, Plane, MoreHorizontal, Loader2
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useExpenseCategories } from '../hooks/useExpenseCategories';
import { ExpenseCategory } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const CATEGORY_ICONS = [
  { name: 'Tag', icon: Tag },
  { name: 'Wallet', icon: Wallet },
  { name: 'Home', icon: Home },
  { name: 'Car', icon: Car },
  { name: 'Shopping', icon: ShoppingCart },
  { name: 'Food', icon: Coffee },
  { name: 'Work', icon: Briefcase },
  { name: 'Team', icon: Users },
  { name: 'Travel', icon: Plane },
  { name: 'Clock', icon: Clock },
];

const ExpenseCategories = () => {
  const { toast } = useToast();
  const { categories, isLoading, addCategory, updateCategory, deleteCategory } = useExpenseCategories();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<ExpenseCategory | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    budget: '',
    icon: 'Tag',
  });
  const [searchTerm, setSearchTerm] = useState('');
  
  const handleOpenDialog = (category?: ExpenseCategory) => {
    if (category) {
      setCurrentCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        budget: category.budget ? category.budget.toString() : '',
        icon: category.icon || 'Tag',
      });
      setIsEditing(true);
    } else {
      setCurrentCategory(null);
      setFormData({
        name: '',
        description: '',
        budget: '',
        icon: 'Tag',
      });
      setIsEditing(false);
    }
    setIsDialogOpen(true);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async () => {
    try {
      const categoryData = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        budget: formData.budget ? parseFloat(formData.budget) : undefined,
      };
      
      if (isEditing && currentCategory) {
        await updateCategory({ id: currentCategory.id, ...categoryData });
        toast({
          title: "Category updated",
          description: `"${formData.name}" category has been updated.`,
        });
      } else {
        await addCategory(categoryData);
        toast({
          title: "Category created",
          description: `"${formData.name}" category has been created.`,
        });
      }
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving category:', error);
      toast({
        title: "Error",
        description: "There was an error saving the category.",
        variant: "destructive",
      });
    }
  };
  
  const handleDelete = async (categoryId: string) => {
    try {
      await deleteCategory(categoryId);
      toast({
        title: "Category deleted",
        description: "The category has been deleted.",
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: "Error",
        description: "There was an error deleting the category.",
        variant: "destructive",
      });
    }
  };
  
  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const getCategoryIcon = (iconName: string) => {
    const found = CATEGORY_ICONS.find(item => item.name === iconName);
    const IconComponent = found ? found.icon : Tag;
    return <IconComponent className="h-4 w-4" />;
  };
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Expense Categories</CardTitle>
          <div className="flex items-center gap-2">
            <Input
              type="search"
              placeholder="Search categories..."
              className="w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={() => handleOpenDialog()}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Category
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>{isEditing ? 'Edit Category' : 'New Category'}</DialogTitle>
                  <DialogDescription>
                    {isEditing 
                      ? 'Edit the expense category and click save when you\'re done.' 
                      : 'Add a new expense category to organize your transactions.'}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Category Name</Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., Office Supplies"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea 
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Brief description of this category"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="budget">Monthly Budget (Optional)</Label>
                    <Input 
                      id="budget"
                      name="budget"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.budget}
                      onChange={handleChange}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label>Icon</Label>
                    <div className="grid grid-cols-5 gap-2">
                      {CATEGORY_ICONS.map((iconItem) => (
                        <Button
                          key={iconItem.name}
                          type="button"
                          variant={formData.icon === iconItem.name ? "default" : "outline"}
                          className="h-10 w-10 p-0"
                          onClick={() => setFormData(prev => ({ ...prev, icon: iconItem.name }))}
                        >
                          <iconItem.icon className="h-4 w-4" />
                          <span className="sr-only">{iconItem.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleSubmit} disabled={!formData.name}>
                    {isEditing ? 'Save Changes' : 'Create Category'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <Card key={category.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/10 text-primary">
                            {category.icon ? getCategoryIcon(category.icon) : <Tag className="h-4 w-4" />}
                          </div>
                          <div>
                            <h3 className="font-medium">{category.name}</h3>
                            {category.budget && (
                              <p className="text-sm text-muted-foreground">
                                Budget: ${category.budget.toFixed(2)}
                              </p>
                            )}
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleOpenDialog(category)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(category.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                  <Tag className="h-12 w-12 mb-2 opacity-20" />
                  <h3 className="text-lg font-medium">No categories found</h3>
                  <p className="max-w-sm">
                    {searchTerm 
                      ? "No categories match your search. Try a different term or clear the search."
                      : "Create your first category by clicking the Add Category button."}
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ExpenseCategories;
