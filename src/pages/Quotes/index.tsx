import { useState } from "react";
import { AppLayout } from "@/components/ui/AppLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusCircle, Search, Filter, Clock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QuotesList } from "./components/QuotesList";
import { QuoteSearch } from "./components/QuoteSearch";
import { RecentQuotes } from "./components/RecentQuotes";
import { useNavigate } from "react-router-dom";
export default function Quotes() {
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();
  const handleCreateQuote = () => {
    navigate("/quotes/new");
  };
  return <AppLayout>
      <div className="p-6 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4 px-0 py-0 my-0 mx-0 bg-slate-200">
          <div className="flex items-center gap-2 ml-0 pl-0 px-0 py-0 mx-0">
            <Button variant="outline" size="sm" onClick={() => navigate(-1)} className="rounded-md border border-gray-300 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A] py-[3px] my-0 mx-0 px-[13px] text-left">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            
            
          </div>
          <Button onClick={handleCreateQuote} className="md:w-auto w-full mx-[240px] px-[189px] py-0 text-[#000a0e]/[0.91] rounded-sm text-2xl border-2 border-[#333333] text-center">
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Quote
          </Button>
        </div>

        <div className="rounded-lg shadow-sm border p-1 mb-6 bg-slate-200">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="all">All Quotes</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="accepted">Accepted</TabsTrigger>
              <TabsTrigger value="expired">Expired</TabsTrigger>
            </TabsList>
            
            <div className="px-4 py-2 mb-4 flex flex-col md:flex-row gap-3">
              <QuoteSearch />
              
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="w-full md:w-auto">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm" className="w-full md:w-auto">
                  <Clock className="h-4 w-4 mr-2" />
                  Recent
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="m-0">
              <QuotesList status="all" />
            </TabsContent>
            
            <TabsContent value="pending" className="m-0">
              <QuotesList status="pending" />
            </TabsContent>
            
            <TabsContent value="accepted" className="m-0">
              <QuotesList status="accepted" />
            </TabsContent>
            
            <TabsContent value="expired" className="m-0">
              <QuotesList status="expired" />
            </TabsContent>
          </Tabs>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentQuotes />
          </div>
          <div>
            <div className="rounded-lg shadow-sm border p-4 bg-slate-200">
              <h2 className="text-lg font-semibold mb-4">Quick Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Quotes This Month</div>
                  <div className="text-2xl font-bold mt-1">12</div>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Acceptance Rate</div>
                  <div className="text-2xl font-bold mt-1">68%</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Avg. Quote Value</div>
                  <div className="text-2xl font-bold mt-1">$2,450</div>
                </div>
                <div className="bg-purple-50 p-3 rounded-lg">
                  <div className="text-sm text-gray-500">Pending</div>
                  <div className="text-2xl font-bold mt-1">8</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>;
}