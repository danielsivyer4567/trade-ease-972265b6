import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronLeft, ChevronRight, MoreHorizontal, Phone, Mail, Calendar, Activity } from "lucide-react";
import { CustomerData } from './CustomerCard';
import { cn } from "@/lib/utils";

interface ModernCustomerTableProps {
  isLoading: boolean;
  filteredCustomers: CustomerData[];
  searchQuery: string;
  onCustomerClick: (id: string) => void;
  onEditClick: (e: React.MouseEvent, customer: CustomerData) => void;
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-pink-500',
    'bg-yellow-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500',
    'bg-orange-500', 'bg-cyan-500', 'bg-lime-500', 'bg-rose-500'
  ];
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 30) return `${diffDays} days ago`;
  return date.toLocaleDateString();
};

const getRandomTags = (customerName: string) => {
  const tagSets = [
    [{ label: 'missed call', color: 'bg-blue-100 text-blue-800' }, { label: '01_base_assistant', color: 'bg-gray-100 text-gray-800' }],
    [{ label: 'tradify_enquiry_sent', color: 'bg-green-100 text-green-800' }, { label: 'booked', color: 'bg-purple-100 text-purple-800' }],
    [{ label: 'new enquiry', color: 'bg-yellow-100 text-yellow-800' }, { label: 'outside_service_area', color: 'bg-red-100 text-red-800' }],
    [{ label: 'customer_has_quote_needs_callback', color: 'bg-orange-100 text-orange-800' }],
    [{ label: 'alert user', color: 'bg-red-100 text-red-800' }],
  ];
  
  const index = customerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % tagSets.length;
  return tagSets[index];
};

const getRandomActivity = (customerName: string) => {
  const activities = [
    { time: '1 hour ago', color: 'text-green-600', icon: Activity },
    { time: '2 hours ago', color: 'text-green-600', icon: Activity },
    { time: '4 hours ago', color: 'text-green-600', icon: Activity },
    { time: '17 hours ago', color: 'text-green-600', icon: Activity },
    { time: '21 hours ago', color: 'text-green-600', icon: Activity },
    { time: '22 hours ago', color: 'text-blue-600', icon: Phone },
    { time: '1 day ago', color: 'text-green-600', icon: Activity },
  ];
  
  const index = customerName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % activities.length;
  return activities[index];
};

export const ModernCustomerTable = ({
  isLoading,
  filteredCustomers,
  searchQuery,
  onCustomerClick,
  onEditClick
}: ModernCustomerTableProps) => {
  const [selectedCustomers, setSelectedCustomers] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  
  const totalPages = Math.ceil(filteredCustomers.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentCustomers = filteredCustomers.slice(startIndex, endIndex);
  
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCustomers(new Set(currentCustomers.map(c => c.id)));
    } else {
      setSelectedCustomers(new Set());
    }
  };
  
  const handleSelectCustomer = (customerId: string, checked: boolean) => {
    const newSelected = new Set(selectedCustomers);
    if (checked) {
      newSelected.add(customerId);
    } else {
      newSelected.delete(customerId);
    }
    setSelectedCustomers(newSelected);
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading customers...</p>
        </div>
      </div>
    );
  }

  if (filteredCustomers.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">
            {searchQuery ? `No customers found matching '${searchQuery}'` : "No customers found"}
          </p>
          <Button>Add Your First Customer</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Table */}
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader className="bg-gradient-to-r from-gray-50 to-white">
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedCustomers.size === currentCustomers.length && currentCustomers.length > 0}
                  onCheckedChange={handleSelectAll}
                  className="h-2 w-2"
                />
              </TableHead>
              <TableHead className="font-medium">Name</TableHead>
              <TableHead className="font-medium">Phone</TableHead>
              <TableHead className="font-medium">Email</TableHead>
              <TableHead className="font-medium">Created</TableHead>
              <TableHead className="font-medium">Last Activity</TableHead>
              <TableHead className="font-medium">Tags</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentCustomers.map((customer) => {
              const initials = getInitials(customer.name);
              const avatarColor = getAvatarColor(customer.name);
              const tags = getRandomTags(customer.name);
              const activity = getRandomActivity(customer.name);
              const ActivityIcon = activity.icon;
              
              return (
                <TableRow
                  key={customer.id}
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 cursor-pointer transition-all duration-200"
                  onClick={() => onCustomerClick(customer.id)}
                >
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <Checkbox
                      checked={selectedCustomers.has(customer.id)}
                      onCheckedChange={(checked) => handleSelectCustomer(customer.id, checked as boolean)}
                      className="h-2 w-2"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <Avatar className={cn("h-8 w-8 transition-all duration-200 hover:scale-110 hover:shadow-md", avatarColor)}>
                        <AvatarFallback className="text-slate-900 font-medium text-sm">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-gray-900">{customer.name}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Phone className="h-4 w-4" />
                      <span>{customer.phone}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {customer.email && (
                      <div className="flex items-center space-x-2 text-blue-600">
                        <Mail className="h-4 w-4" />
                        <span>{customer.email}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-gray-500">
                      <div>Jul 10 2025</div>
                      <div className="text-xs text-gray-400">12:32 PM (AEST)</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className={cn("flex items-center space-x-2 text-sm", activity.color)}>
                      <ActivityIcon className="h-4 w-4" />
                      <span>{activity.time}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {tags.map((tag, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className={cn("text-xs", tag.color)}
                        >
                          {tag.label}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={(e) => onEditClick(e, customer)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          Send Message
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="border-t border-gray-200 bg-gradient-to-r from-white to-gray-50 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="text-sm text-gray-700">
          Total <span className="font-medium text-blue-600">3322</span> records | {startIndex + 1} of {Math.min(endIndex, filteredCustomers.length)} Pages
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="flex items-center space-x-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1;
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                  className="h-8 w-8 p-0"
                >
                  {pageNum}
                </Button>
              );
            })}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          
          <div className="ml-4 text-sm text-gray-500">
            Page Size: <span className="font-medium">20</span>
          </div>
        </div>
      </div>
    </div>
  );
};