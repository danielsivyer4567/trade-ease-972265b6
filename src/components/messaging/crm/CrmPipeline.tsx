import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Inbox, PhoneCall, FileText, Clock, X, CheckCircle, ChevronRight, MessageSquare, User, Calendar, PlusCircle, Bell, AlertTriangle, Plus, Maximize2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from 'react-router-dom';
import { CustomerStageIndicator } from '@/components/dashboard/CustomerStageIndicator';

// Mock pipelines
const PIPELINES = [{
  id: 'sales',
  name: 'Sales Pipeline',
  attentionCount: 3
}, {
  id: 'support',
  name: 'Support Pipeline',
  attentionCount: 5
}, {
  id: 'installation',
  name: 'Installation Pipeline',
  attentionCount: 0
}];

// Mock data for example purposes
const MOCK_CUSTOMERS = [{
  id: '1',
  name: 'John Smith',
  phone: '+1 555-123-4567',
  lastMessage: 'I need a quote for my project',
  timestamp: '2h ago',
  stage: 'new',
  pipelineId: 'sales',
  needsAttention: true
}, {
  id: '2',
  name: 'Sarah Johnson',
  phone: '+1 555-987-6543',
  lastMessage: "What's your availability next week?",
  timestamp: '4h ago',
  stage: 'new',
  pipelineId: 'sales',
  needsAttention: true
}, {
  id: '3',
  name: 'Michael Brown',
  phone: '+1 555-321-7654',
  lastMessage: "I'd like to schedule a consultation",
  timestamp: '6h ago',
  stage: 'quoteBooked',
  pipelineId: 'sales',
  needsAttention: false
}, {
  id: '4',
  name: 'Jessica Davis',
  phone: '+1 555-765-4321',
  lastMessage: 'Thanks for sending that over',
  timestamp: '12h ago',
  stage: 'quoteSent',
  pipelineId: 'sales',
  needsAttention: false
}, {
  id: '5',
  name: 'David Wilson',
  phone: '+1 555-345-6789',
  lastMessage: 'The price is a bit high for me',
  timestamp: '1d ago',
  stage: 'followUp',
  pipelineId: 'sales',
  needsAttention: true
}, {
  id: '6',
  name: 'Emily Taylor',
  phone: '+1 555-678-9012',
  lastMessage: "I'll send the signed contract tomorrow",
  timestamp: '2d ago',
  stage: 'followUp',
  pipelineId: 'sales',
  needsAttention: false
}, {
  id: '7',
  name: 'Robert Martinez',
  phone: '+1 555-234-5678',
  lastMessage: "We're outside your service area",
  timestamp: '3d ago',
  stage: 'notServiceable',
  pipelineId: 'support',
  needsAttention: false
}, {
  id: '8',
  name: 'Amanda Clark',
  phone: '+1 555-432-1098',
  lastMessage: "I've decided to go with another company",
  timestamp: '5d ago',
  stage: 'followUp',
  pipelineId: 'support',
  needsAttention: false
}, {
  id: '9',
  name: 'Tom Edwards',
  phone: '+1 555-876-5432',
  lastMessage: "When will the installation team arrive?",
  timestamp: '1h ago',
  stage: 'new',
  pipelineId: 'installation',
  needsAttention: false
}, {
  id: '10',
  name: 'Lisa Morgan',
  phone: '+1 555-345-6789',
  lastMessage: "Is there a problem with my order?",
  timestamp: '3h ago',
  stage: 'followUp',
  pipelineId: 'support',
  needsAttention: true
}, {
  id: '11',
  name: 'Kevin Robinson',
  phone: '+1 555-234-5678',
  lastMessage: "The technician didn't show up",
  timestamp: '5h ago',
  stage: 'quoteBooked',
  pipelineId: 'support',
  needsAttention: true
}, {
  id: '12',
  name: 'Patricia White',
  phone: '+1 555-987-6543',
  lastMessage: "My system is still not working properly",
  timestamp: '8h ago',
  stage: 'followUp',
  pipelineId: 'support',
  needsAttention: true
}];

export const CrmPipeline: React.FC = () => {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
  const [draggedCustomer, setDraggedCustomer] = useState<string | null>(null);
  const [activePipeline, setActivePipeline] = useState<string>(PIPELINES[0].id);
  const moveCustomer = (customerId: string, targetStage: string) => {
    setCustomers(prev => prev.map(customer => customer.id === customerId ? {
      ...customer,
      stage: targetStage
    } : customer));
  };

  // Filter customers by stage and pipeline
  const getCustomersByStage = (stage: string) => {
    return customers.filter(customer => customer.stage === stage && customer.pipelineId === activePipeline);
  };

  // Get count of customers needing attention in a pipeline
  const getAttentionCount = (pipelineId: string) => {
    return customers.filter(customer => customer.pipelineId === pipelineId && customer.needsAttention).length;
  };
  const handleDragStart = (customerId: string) => {
    setDraggedCustomer(customerId);
  };
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
  };
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetStage: string) => {
    e.preventDefault();
    if (draggedCustomer) {
      moveCustomer(draggedCustomer, targetStage);
      setDraggedCustomer(null);
    }
  };
  const handlePipelineChange = (value: string) => {
    setActivePipeline(value);
  };
  return <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Tabs value={activePipeline} onValueChange={handlePipelineChange} className="w-full">
            <TabsList>
              {PIPELINES.map(pipeline => <TabsTrigger 
                  key={pipeline.id} 
                  value={pipeline.id} 
                  className="relative text-gray-950 bg-slate-400 hover:bg-slate-300 mx-[9px] data-[state=active]:bg-slate-200"
                >
                  {pipeline.name}
                  {pipeline.attentionCount > 0 && <Badge variant="destructive" className="ml-1 absolute -top-2 -right-2 flex items-center justify-center h-5 w-5 p-0 rounded-full">
                      <span className="text-[11px]">{pipeline.attentionCount}</span>
                    </Badge>}
                </TabsTrigger>)}
            </TabsList>
          </Tabs>
          <span className="text-sm text-gray-950">
            {getAttentionCount(activePipeline) > 0 && <div className="flex items-center bg-slate-300">
                <AlertTriangle className="h-4 w-4 text-red-500 mr-1" />
                <span>{getAttentionCount(activePipeline)} customers need attention</span>
              </div>}
          </span>
        </div>
        <Button variant="outline" size="sm" className="gap-1 bg-slate-500 hover:bg-slate-400">
          <Plus className="h-4 w-4" />
          New Pipeline
        </Button>
      </div>
      
      <div className="overflow-x-auto pb-4">
        <div className="flex gap-4 min-w-[1200px]">
          {/* New Enquiry */}
          <PipelineStage title="New Enquiry" icon={<Inbox className="h-5 w-5 text-blue-600" />} count={getCustomersByStage('new').length} attentionCount={getCustomersByStage('new').filter(c => c.needsAttention).length} color="bg-blue-100" customers={getCustomersByStage('new')} stageName="new" onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />

          {/* Quote Booked */}
          <PipelineStage title="Quote Booked" icon={<Calendar className="h-5 w-5 text-purple-600" />} count={getCustomersByStage('quoteBooked').length} attentionCount={getCustomersByStage('quoteBooked').filter(c => c.needsAttention).length} color="bg-purple-100" customers={getCustomersByStage('quoteBooked')} stageName="quoteBooked" onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />

          {/* Not Serviceable */}
          <PipelineStage title="Not Serviceable" icon={<X className="h-5 w-5 text-red-600" />} count={getCustomersByStage('notServiceable').length} attentionCount={getCustomersByStage('notServiceable').filter(c => c.needsAttention).length} color="bg-red-100" customers={getCustomersByStage('notServiceable')} stageName="notServiceable" onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />

          {/* Quote Sent */}
          <PipelineStage title="Quote Sent" icon={<FileText className="h-5 w-5 text-indigo-600" />} count={getCustomersByStage('quoteSent').length} attentionCount={getCustomersByStage('quoteSent').filter(c => c.needsAttention).length} color="bg-indigo-100" customers={getCustomersByStage('quoteSent')} stageName="quoteSent" onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />

          {/* Auto Follow Up */}
          <PipelineStage title="Auto Follow Up" icon={<Clock className="h-5 w-5 text-amber-600" />} count={getCustomersByStage('followUp').length} attentionCount={getCustomersByStage('followUp').filter(c => c.needsAttention).length} color="bg-amber-100" customers={getCustomersByStage('followUp')} stageName="followUp" onDragStart={handleDragStart} onDragOver={handleDragOver} onDrop={handleDrop} />
        </div>
      </div>
    </div>;
};

interface PipelineStageProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  attentionCount: number;
  color: string;
  customers: Array<{
    id: string;
    name: string;
    phone: string;
    lastMessage: string;
    timestamp: string;
    needsAttention?: boolean;
  }>;
  stageName: string;
  onDragStart: (customerId: string) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>, stageName: string) => void;
}

const PipelineStage: React.FC<PipelineStageProps> = ({
  title,
  icon,
  count,
  attentionCount,
  color,
  customers,
  stageName,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  return <div className="w-[250px] flex-shrink-0" onDragOver={onDragOver} onDrop={e => onDrop(e, stageName)}>
      <Card className="h-full">
        <CardHeader className={`${color} py-2 px-3`}>
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <span>{title}</span>
              {attentionCount > 0 && <Badge variant="destructive" className="flex items-center justify-center h-5 w-5 p-0 rounded-full">
                  <span className="text-[11px]">{attentionCount}</span>
                </Badge>}
            </div>
            <span className="bg-white text-gray-800 text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {count}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 overflow-y-auto" style={{
        maxHeight: '500px'
      }}>
          <div className="space-y-2">
            {customers.map(customer => <CustomerCard key={customer.id} customer={customer} onDragStart={() => onDragStart(customer.id)} />)}
          </div>
        </CardContent>
      </Card>
    </div>;
};

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    phone: string;
    lastMessage: string;
    timestamp: string;
    needsAttention?: boolean;
  };
  onDragStart: () => void;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onDragStart
}) => {
  const navigate = useNavigate();

  const handleExpandCustomer = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/customers/${customer.id}`);
  };

  return <div draggable onDragStart={onDragStart} className="px-3 py-2 my-1 bg-white rounded-md shadow-sm hover:shadow-md transition-shadow border border-gray-100">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="flex-shrink-0">
            <CustomerStageIndicator customerId={customer.id} size="sm" />
          </div>
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-medium text-sm">{customer.name}</h4>
              {customer.needsAttention && <AlertTriangle className="h-3 w-3 text-red-500" />}
            </div>
            <p className="text-xs text-gray-500">{customer.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6"
            onClick={handleExpandCustomer}
            title="Expand customer details"
          >
            <Maximize2 className="h-3.5 w-3.5 text-gray-500" />
          </Button>
          <span className="text-xs text-gray-400">{customer.timestamp}</span>
        </div>
      </div>
      
      <div className="mt-2 flex items-start gap-1">
        <MessageSquare className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-600 line-clamp-2">{customer.lastMessage}</p>
      </div>
    </div>;
};
