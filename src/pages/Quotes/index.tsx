import React, { useState } from 'react';
import { AppLayout } from "@/components/ui/AppLayout";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Plus, Search, ChevronDown } from "lucide-react";
import NewQuote from './NewQuote';
import { Input } from "@/components/ui/input";

// Mock data for quote counts
const statusCounts = {
  draft: 636,
  awaiting: 3797,
  accepted: 721,
  declined: 457,
  cancelled: 1039,
  all: 6650,
  templates: 106
};

const Quotes = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');

  const handleNewQuote = () => {
    navigate('/quotes/new');
  };

  return (
    <AppLayout>
      <div className="container mx-auto p-4">
        {/* Status tabs */}
        <div className="flex flex-wrap mb-4 border-b-0">
          <button 
            className={`px-6 py-3 text-sm ${activeTab === 'draft' ? 'bg-white' : 'bg-gray-100'} border border-gray-500 rounded-t-md`}
            onClick={() => setActiveTab('draft')}
          >
            Draft <span className="ml-2 bg-gray-500 text-white text-xs rounded px-1.5">{statusCounts.draft}</span>
          </button>
          <button 
            className={`px-6 py-3 text-sm ${activeTab === 'awaiting' ? 'bg-white' : 'bg-gray-100'} border border-gray-500 rounded-t-md`}
            onClick={() => setActiveTab('awaiting')}
          >
            Awaiting Acceptance <span className="ml-2 bg-gray-500 text-white text-xs rounded px-1.5">{statusCounts.awaiting}</span>
          </button>
          <button 
            className={`px-6 py-3 text-sm ${activeTab === 'accepted' ? 'bg-white' : 'bg-gray-100'} border border-gray-500 rounded-t-md`}
            onClick={() => setActiveTab('accepted')}
          >
            Accepted <span className="ml-2 bg-gray-500 text-white text-xs rounded px-1.5">{statusCounts.accepted}</span>
          </button>
          <button 
            className={`px-6 py-3 text-sm ${activeTab === 'declined' ? 'bg-white' : 'bg-gray-100'} border border-gray-500 rounded-t-md`}
            onClick={() => setActiveTab('declined')}
          >
            Declined <span className="ml-2 bg-gray-500 text-white text-xs rounded px-1.5">{statusCounts.declined}</span>
          </button>
          <button 
            className={`px-6 py-3 text-sm ${activeTab === 'cancelled' ? 'bg-white' : 'bg-gray-100'} border border-gray-500 rounded-t-md`}
            onClick={() => setActiveTab('cancelled')}
          >
            Cancelled <span className="ml-2 bg-gray-500 text-white text-xs rounded px-1.5">{statusCounts.cancelled}</span>
          </button>
          <button 
            className={`px-6 py-3 text-sm ${activeTab === 'all' ? 'bg-white' : 'bg-gray-100'} border border-gray-500 rounded-t-md`}
            onClick={() => setActiveTab('all')}
          >
            All <span className="ml-2 bg-gray-500 text-white text-xs rounded px-1.5">{statusCounts.all}</span>
          </button>
          <button 
            className={`px-6 py-3 text-sm ${activeTab === 'templates' ? 'bg-white' : 'bg-gray-100'} border border-gray-500 rounded-t-md`}
            onClick={() => setActiveTab('templates')}
          >
            Templates <span className="ml-2 bg-gray-500 text-white text-xs rounded px-1.5">{statusCounts.templates}</span>
          </button>
        </div>

        <div className="bg-white border border-gray-500 p-6 rounded-b-md">
          {/* Action bar */}
          <div className="flex justify-between mb-6">
            <div className="flex">
              <Button 
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded mr-1"
                onClick={handleNewQuote}
              >
                New Quote
              </Button>
              <Button 
                variant="outline" 
                className="bg-white border-gray-500 hover:bg-gray-100"
              >
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            {/* Search */}
            <div className="relative w-80">
              <Input 
                type="text" 
                placeholder="Search" 
                className="pl-3 py-2 border border-gray-500 rounded w-full focus:outline-none focus:ring-1 focus:ring-gray-500"
              />
              <button className="absolute right-0 top-0 h-full px-3 bg-cyan-500 rounded-r">
                <Search className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Quote table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-300">
                <th className="p-3 w-10">
                  <input type="checkbox" className="rounded border-gray-500" />
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center">
                    <span>Quote No</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center">
                    <span>Customer</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center">
                    <span>Reference</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center">
                    <span>Status</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center">
                    <span>Delivery</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center">
                    <span>Job</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center">
                    <span>Expiry Date</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center">
                    <span>Gross Profit</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
                <th className="p-3 text-left">
                  <div className="flex items-center">
                    <span>Total</span>
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Sample rows - these would be populated from your data */}
              <tr className="border-b border-gray-300 hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" className="rounded border-gray-500" /></td>
                <td className="p-3 text-cyan-500">QT05668</td>
                <td className="p-3">Narelle Bishara</td>
                <td className="p-3">4 Clinton ave Burlington</td>
                <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Approved</span></td>
                <td className="p-3">Sent</td>
                <td className="p-3"></td>
                <td className="p-3">05 Jul 2025</td>
                <td className="p-3">7,021.82</td>
                <td className="p-3">7,724.00</td>
              </tr>
              <tr className="border-b border-gray-300 hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" className="rounded border-gray-500" /></td>
                <td className="p-3 text-cyan-500">QT05666</td>
                <td className="p-3">Anthony Purcell</td>
                <td className="p-3">PVC fencing</td>
                <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Approved</span></td>
                <td className="p-3">Viewed</td>
                <td className="p-3"></td>
                <td className="p-3">05 Jul 2025</td>
                <td className="p-3">9,140.00</td>
                <td className="p-3">10,054.00</td>
              </tr>
              <tr className="border-b border-gray-300 hover:bg-gray-50">
                <td className="p-3"><input type="checkbox" className="rounded border-gray-500" /></td>
                <td className="p-3 text-cyan-500">QT05665</td>
                <td className="p-3">Victoria Taylor</td>
                <td className="p-3">PVC</td>
                <td className="p-3"><span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Approved</span></td>
                <td className="p-3">Viewed</td>
                <td className="p-3"></td>
                <td className="p-3">05 Jul 2025</td>
                <td className="p-3">6,031.82</td>
                <td className="p-3">8,075.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

export { Quotes as default, NewQuote };
