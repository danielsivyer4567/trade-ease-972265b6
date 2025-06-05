import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ChevronDown, ArrowUp, ArrowDown, Eye, Clock, Check, X, FileText, Copy, Filter, Calendar, Trash2, Download, MoreHorizontal, Zap } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardHeader } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface Quote {
  id: string;
  number: string;
  customer: string;
  reference: string;
  status: 'approved' | 'declined' | 'viewed' | 'sent';
  delivery: 'viewed' | 'sent';
  expiryDate: string;
  grossProfit: number;
  total: number;
}

export const QuotesList = () => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [searchTerm, setSearchTerm] = useState('');

  const dummyQuotes: Quote[] = [
    { id: 'QT05252', number: 'QT05252', customer: 'Tara Hellinga', reference: 'front', status: 'approved', delivery: 'viewed', expiryDate: '17 May 2025', grossProfit: 2000.00, total: 2220.00 },
    { id: 'QT05251', number: 'QT05251', customer: 'Tara Hellinga', reference: 'Colorbond left', status: 'approved', delivery: 'viewed', expiryDate: '17 May 2025', grossProfit: 6000.00, total: 6633.00 },
    { id: 'QT052952', number: 'QT052952', customer: 'Caroline Warner', reference: 'Lacpec', status: 'approved', delivery: 'sent', expiryDate: '17 May 2025', grossProfit: 11800.00, total: 14212.00 },
    { id: 'QT05249', number: 'QT05249', customer: 'Jason Collis', reference: '', status: 'approved', delivery: 'viewed', expiryDate: '17 May 2025', grossProfit: 6800.00, total: 7558.00 },
    { id: 'QT05248', number: 'QT05248', customer: 'Mitchell Morrow', reference: 'Colorbond', status: 'approved', delivery: 'viewed', expiryDate: '17 May 2025', grossProfit: 6270.00, total: 6837.00 },
    { id: 'QT05247', number: 'QT05247', customer: 'Mitchell Morrow', reference: 'Colorbond', status: 'approved', delivery: 'viewed', expiryDate: '17 May 2025', grossProfit: 5520.00, total: 6053.00 },
    { id: 'QT05246', number: 'QT05246', customer: 'Marlene Wassef', reference: 'Gate and return', status: 'approved', delivery: 'viewed', expiryDate: '17 May 2025', grossProfit: 2280.00, total: 2528.00 },
    { id: 'QT05245', number: 'QT05245', customer: 'Marlene Wassef', reference: 'Back fence', status: 'approved', delivery: 'viewed', expiryDate: '17 May 2025', grossProfit: 2730.00, total: 3023.00 },
    { id: 'QT05244', number: 'QT05244', customer: 'Marlene Wassef', reference: 'Back fence', status: 'approved', delivery: 'viewed', expiryDate: '17 May 2025', grossProfit: 2310.00, total: 2547.00 },
    { id: 'QT05243', number: 'QT05243', customer: 'Philip Barrett', reference: 'Right', status: 'approved', delivery: 'viewed', expiryDate: '17 May 2025', grossProfit: 3070.00, total: 3377.00 },
  ];

  const filterQuotes = (quotes: Quote[]) => {
    if (!searchTerm) return quotes;
    
    return quotes.filter(quote => 
      quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.reference.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const sortQuotes = (quotes: Quote[]) => {
    if (!sortField) return quotes;
    
    return [...quotes].sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleNewQuote = () => {
    navigate('/quotes/new');
  };

  const getStatusBadge = (status: Quote['status']) => {
    switch (status) {
      case 'approved':
        return (
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center justify-center w-24 shadow-sm">
            <Check className="h-3.5 w-3.5 mr-1.5" />
            Approved
          </div>
        );
      case 'declined':
        return (
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center justify-center w-24 shadow-sm">
            <X className="h-3.5 w-3.5 mr-1.5" />
            Declined
          </div>
        );
      case 'viewed':
        return (
          <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center justify-center w-24 shadow-sm">
            <Eye className="h-3.5 w-3.5 mr-1.5" />
            Viewed
          </div>
        );
      case 'sent':
        return (
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center justify-center w-24 shadow-sm">
            <Clock className="h-3.5 w-3.5 mr-1.5" />
            Sent
          </div>
        );
    }
  };

  const getDeliveryStatus = (delivery: Quote['delivery']) => {
    switch (delivery) {
      case 'viewed':
        return (
          <div className="text-sm text-slate-700 flex items-center">
            <div className="w-2 h-2 rounded-full bg-blue-500 mr-2.5 shadow-sm shadow-blue-200"></div>
            <Eye className="h-4 w-4 mr-1.5 text-blue-500" />
            Viewed
          </div>
        );
      case 'sent':
        return (
          <div className="text-sm text-slate-700 flex items-center">
            <div className="w-2 h-2 rounded-full bg-amber-500 mr-2.5 shadow-sm shadow-amber-200"></div>
            <Clock className="h-4 w-4 mr-1.5 text-amber-500" />
            Sent
          </div>
        );
    }
  };

  const displayedQuotes = sortQuotes(filterQuotes(dummyQuotes));

  // Function to get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase();
  };

  // Function to get a color based on the customer name (pseudo-random but consistent)
  const getCustomerColor = (name: string) => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-amber-500', 'bg-pink-500', 'bg-indigo-500',
      'bg-red-500', 'bg-teal-500', 'bg-cyan-500'
    ];
    
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }
    
    return colors[sum % colors.length];
  };

  return (
    <Card className="overflow-hidden border-slate-200 shadow-md rounded-xl animate-in fade-in-50 duration-300">
      <CardHeader className="p-4 border-b border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                onClick={handleNewQuote}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg flex items-center shadow-sm transition-all duration-200 hover:shadow-md hover:translate-y-[-2px]"
              >
                <Plus className="h-4 w-4 mr-1.5" />
                New Quote
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Create a new quote</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="border-slate-300 flex items-center gap-2 h-9 shadow-sm hover:shadow hover:border-slate-400 transition-all duration-200">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-slate-700">Filter</span>
          </Button>
          
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search quotes..." 
              className="pl-9 h-9 border-slate-300 focus-visible:ring-blue-500 w-full rounded-lg shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </CardHeader>
      
      {/* Quote list table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => handleSort('number')}
              >
                <div className="flex items-center space-x-1.5">
                  <span>Quote No</span>
                  {sortField === 'number' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => handleSort('customer')}
              >
                <div className="flex items-center space-x-1.5">
                  <span>Customer</span>
                  {sortField === 'customer' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => handleSort('reference')}
              >
                <div className="flex items-center space-x-1.5">
                  <span>Reference</span>
                  {sortField === 'reference' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1.5">
                  <span>Status</span>
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => handleSort('delivery')}
              >
                <div className="flex items-center space-x-1.5">
                  <span>Delivery</span>
                  {sortField === 'delivery' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider">
                <div className="flex items-center space-x-1.5">
                  <span>Replies</span>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => handleSort('expiryDate')}
              >
                <div className="flex items-center space-x-1.5">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>Expiry Date</span>
                  {sortField === 'expiryDate' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => handleSort('grossProfit')}
              >
                <div className="flex items-center space-x-1.5">
                  <Zap className="h-3.5 w-3.5 mr-1 text-green-500" />
                  <span>Gross Profit</span>
                  {sortField === 'grossProfit' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 transition-colors"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center space-x-1.5">
                  <span>Total</span>
                  {sortField === 'total' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-slate-600 uppercase tracking-wider">
                <span>Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {displayedQuotes.map((quote, index) => (
              <tr 
                key={quote.id}
                className="hover:bg-blue-50 cursor-pointer transition-all duration-200"
                onClick={() => navigate(`/quotes/${quote.id}`)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm font-medium text-blue-600">{quote.number}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar className={`h-8 w-8 mr-3 ${getCustomerColor(quote.customer)} shadow-sm`}>
                      <div className="text-xs font-medium text-white">
                        {getInitials(quote.customer)}
                      </div>
                    </Avatar>
                    <span className="text-sm font-medium text-slate-700">{quote.customer}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-700">{quote.reference || '-'}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getStatusBadge(quote.status)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {getDeliveryStatus(quote.delivery)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Badge className="bg-green-100 text-green-800 px-3 py-1 rounded-full shadow-sm">Replied</Badge>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-slate-400 mr-2" />
                    <span className="text-sm text-slate-700">{quote.expiryDate}</span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-green-600 font-medium">${quote.grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className="text-sm text-slate-800 font-medium">${quote.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-slate-200">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[180px] shadow-md">
                      <DropdownMenuItem className="cursor-pointer" onClick={() => navigate(`/quotes/${quote.id}`)}>
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Copy className="h-4 w-4 mr-2" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer text-red-600">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Bottom: pagination & summary */}
      <div className="p-4 border-t border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-slate-600">
          Showing <span className="font-medium">{displayedQuotes.length}</span> of <span className="font-medium">{dummyQuotes.length}</span> quotes
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="px-3 h-8 border-slate-300 shadow-sm hover:shadow hover:border-slate-400 transition-all duration-200">
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="px-3 h-8 bg-blue-50 border-blue-200 text-blue-600 shadow-sm">1</Button>
            <Button variant="outline" size="sm" className="px-3 h-8 border-slate-300 shadow-sm hover:shadow hover:border-slate-400 transition-all duration-200">2</Button>
            <Button variant="outline" size="sm" className="px-3 h-8 border-slate-300 shadow-sm hover:shadow hover:border-slate-400 transition-all duration-200">3</Button>
          </div>
          <Button variant="outline" size="sm" className="px-3 h-8 border-slate-300 shadow-sm hover:shadow hover:border-slate-400 transition-all duration-200">
            Next
          </Button>
        </div>
      </div>
    </Card>
  );
}; 