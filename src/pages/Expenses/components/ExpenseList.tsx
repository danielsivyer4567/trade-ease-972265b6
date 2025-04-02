
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, AlertCircle, MoreHorizontal, Receipt } from "lucide-react";
import { Expense } from '../types';
import { Button } from '@/components/ui/button';
import { formatDate } from '../utils/dateUtils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ExpenseListProps {
  expenses: Expense[];
  limit?: number;
  onViewDetails?: (expense: Expense) => void;
  onApprove?: (expense: Expense) => void;
  onReject?: (expense: Expense) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({ 
  expenses, 
  limit,
  onViewDetails,
  onApprove, 
  onReject 
}) => {
  const displayExpenses = limit ? expenses.slice(0, limit) : expenses;
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'approved':
        return <Badge className="bg-green-500"><Check className="w-3 h-3 mr-1" /> Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" /> Rejected</Badge>;
      default:
        return <Badge variant="outline" className="border-amber-500 text-amber-500"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Vendor</TableHead>
            <TableHead>Category</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {displayExpenses.length > 0 ? (
            displayExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{formatDate(expense.date)}</TableCell>
                <TableCell>{expense.vendor}</TableCell>
                <TableCell>{expense.category}</TableCell>
                <TableCell className="text-right">${expense.amount.toFixed(2)}</TableCell>
                <TableCell>{getStatusBadge(expense.status)}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails?.(expense)}>
                        View Details
                      </DropdownMenuItem>
                      {expense.receipt && (
                        <DropdownMenuItem>
                          <a href={expense.receipt} target="_blank" rel="noopener noreferrer" className="flex items-center">
                            <Receipt className="mr-2 h-4 w-4" />
                            View Receipt
                          </a>
                        </DropdownMenuItem>
                      )}
                      {expense.status === 'pending' && onApprove && (
                        <DropdownMenuItem onClick={() => onApprove(expense)}>
                          <Check className="mr-2 h-4 w-4" /> Approve
                        </DropdownMenuItem>
                      )}
                      {expense.status === 'pending' && onReject && (
                        <DropdownMenuItem onClick={() => onReject(expense)}>
                          <AlertCircle className="mr-2 h-4 w-4" /> Reject
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                No expenses found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExpenseList;
