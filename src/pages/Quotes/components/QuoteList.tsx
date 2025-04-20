import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, ChevronDown, ArrowUp, ArrowDown, Eye, Clock, Check, X, FileText, Copy } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useNavigate } from 'react-router-dom';

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
          <div className="bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded-md flex items-center justify-center">
            Approved
          </div>
        );
      case 'declined':
        return (
          <div className="bg-red-500 text-white text-xs font-semibold px-3 py-1 rounded-md flex items-center justify-center">
            Declined
          </div>
        );
      case 'viewed':
        return (
          <div className="bg-green-500 text-white text-xs font-semibold px-3 py-1 rounded-md flex items-center justify-center">
            Viewed
          </div>
        );
      case 'sent':
        return (
          <div className="bg-amber-500 text-white text-xs font-semibold px-3 py-1 rounded-md flex items-center justify-center">
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
            <Eye className="h-4 w-4 mr-1 text-blue-500" />
            Viewed
          </div>
        );
      case 'sent':
        return (
          <div className="text-sm text-slate-700 flex items-center">
            <Clock className="h-4 w-4 mr-1 text-amber-500" />
            Sent
          </div>
        );
    }
  };

  const displayedQuotes = sortQuotes(filterQuotes(dummyQuotes));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      {/* Header with New Quote button and search */}
      <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Button 
          onClick={handleNewQuote}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center"
        >
          <Plus className="h-4 w-4 mr-1.5" />
          New Quote
        </Button>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input 
            placeholder="Search..." 
            className="pl-9 h-9 border-slate-300 focus:border-blue-500 w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Quote list table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-100">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200"
                onClick={() => handleSort('number')}
              >
                <div className="flex items-center space-x-1">
                  <span>Quote No</span>
                  {sortField === 'number' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200"
                onClick={() => handleSort('customer')}
              >
                <div className="flex items-center space-x-1">
                  <span>Customer</span>
                  {sortField === 'customer' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200"
                onClick={() => handleSort('reference')}
              >
                <div className="flex items-center space-x-1">
                  <span>Reference</span>
                  {sortField === 'reference' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center space-x-1 relative group">
                  <span>Status</span>
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                  <div className="absolute -bottom-10 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      Approved/Denied
                    </Badge>
                  </div>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200"
                onClick={() => handleSort('delivery')}
              >
                <div className="flex items-center space-x-1 relative group">
                  <span>Delivery</span>
                  {sortField === 'delivery' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                  <div className="absolute -bottom-10 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Badge className="bg-blue-100 text-blue-800 text-xs whitespace-nowrap">
                      Quote viewed by customer
                    </Badge>
                  </div>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider relative group cursor-pointer hover:bg-slate-200"
              >
                <div className="flex items-center space-x-1">
                  <span>Replies</span>
                </div>
                <div className="absolute -bottom-10 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Badge className="bg-blue-100 text-blue-800 text-xs">
                    Quote Responses
                  </Badge>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200"
                onClick={() => handleSort('expiryDate')}
              >
                <div className="flex items-center space-x-1">
                  <span>Expiry Date</span>
                  {sortField === 'expiryDate' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200 relative group"
                onClick={() => handleSort('grossProfit')}
              >
                <div className="flex items-center space-x-1">
                  <span>Gross Profit</span>
                  {sortField === 'grossProfit' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
                <div className="absolute -bottom-10 left-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Badge className="bg-blue-100 text-blue-800 text-xs whitespace-nowrap">
                    Calculated profit with costs
                  </Badge>
                </div>
              </th>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-200"
                onClick={() => handleSort('total')}
              >
                <div className="flex items-center space-x-1">
                  <span>Total</span>
                  {sortField === 'total' && (
                    sortDirection === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {displayedQuotes.map((quote) => (
              <tr 
                key={quote.id}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => navigate(`/quotes/${quote.id}`)}
              >
                <td className="px-4 py-3.5 whitespace-nowrap text-sm font-medium text-blue-600">{quote.number}</td>
                <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-700">{quote.customer}</td>
                <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-700">{quote.reference}</td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {getStatusBadge(quote.status)}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  {getDeliveryStatus(quote.delivery)}
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <Badge className="bg-green-100 text-green-800">Replied</Badge>
                </td>
                <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-700">{quote.expiryDate}</td>
                <td className="px-4 py-3.5 whitespace-nowrap text-sm text-green-600 font-medium">${quote.grossProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                <td className="px-4 py-3.5 whitespace-nowrap text-sm text-slate-700 font-medium">${quote.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Bottom: pagination & summary */}
      <div className="p-4 border-t border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-slate-600">
          Showing <span className="font-medium">{displayedQuotes.length}</span> of <span className="font-medium">{dummyQuotes.length}</span> quotes
        </div>
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="px-3 h-8">
            Previous
          </Button>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="px-3 h-8 bg-blue-50 border-blue-200 text-blue-600">1</Button>
            <Button variant="outline" size="sm" className="px-3 h-8">2</Button>
            <Button variant="outline" size="sm" className="px-3 h-8">3</Button>
          </div>
          <Button variant="outline" size="sm" className="px-3 h-8">
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}; 