
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Inbox, PhoneCall, FileText, Clock, X, CheckCircle, 
  ChevronRight, MessageSquare, User, Calendar, PlusCircle 
} from "lucide-react";

// Mock data for example purposes
const MOCK_CUSTOMERS = [
  { 
    id: '1', 
    name: 'John Smith', 
    phone: '+1 555-123-4567', 
    lastMessage: 'I need a quote for my project',
    timestamp: '2h ago',
    stage: 'new'
  },
  { 
    id: '2', 
    name: 'Sarah Johnson', 
    phone: '+1 555-987-6543', 
    lastMessage: 'What\'s your availability next week?',
    timestamp: '4h ago',
    stage: 'new'
  },
  { 
    id: '3', 
    name: 'Michael Brown', 
    phone: '+1 555-321-7654', 
    lastMessage: 'I'd like to schedule a consultation',
    timestamp: '6h ago',
    stage: 'quoteBooked'
  },
  { 
    id: '4', 
    name: 'Jessica Davis', 
    phone: '+1 555-765-4321', 
    lastMessage: 'Thanks for sending that over',
    timestamp: '12h ago',
    stage: 'quoteSent'
  },
  { 
    id: '5', 
    name: 'David Wilson', 
    phone: '+1 555-345-6789', 
    lastMessage: 'The price is a bit high for me',
    timestamp: '1d ago',
    stage: 'followUp'
  },
  { 
    id: '6', 
    name: 'Emily Taylor', 
    phone: '+1 555-678-9012', 
    lastMessage: 'I'll send the signed contract tomorrow',
    timestamp: '2d ago',
    stage: 'accepted'
  },
  { 
    id: '7', 
    name: 'Robert Martinez', 
    phone: '+1 555-234-5678', 
    lastMessage: 'We're outside your service area',
    timestamp: '3d ago',
    stage: 'notServiceable'
  },
  { 
    id: '8', 
    name: 'Amanda Clark', 
    phone: '+1 555-432-1098', 
    lastMessage: 'I've decided to go with another company',
    timestamp: '5d ago',
    stage: 'denied'
  }
];

export const CrmPipeline: React.FC = () => {
  const [customers, setCustomers] = useState(MOCK_CUSTOMERS);

  const moveCustomer = (customerId: string, targetStage: string) => {
    setCustomers(prev => 
      prev.map(customer => 
        customer.id === customerId 
          ? { ...customer, stage: targetStage } 
          : customer
      )
    );
  };

  // Filter customers by stage
  const getCustomersByStage = (stage: string) => {
    return customers.filter(customer => customer.stage === stage);
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-[1200px]">
        {/* New Enquiry */}
        <PipelineStage 
          title="New Enquiry" 
          icon={<Inbox className="h-5 w-5 text-blue-600" />}
          count={getCustomersByStage('new').length}
          color="bg-blue-100"
          customers={getCustomersByStage('new')}
          onMoveCustomer={(id) => moveCustomer(id, 'quoteBooked')}
          targetStageName="Quote Booked"
        />

        {/* Quote Booked */}
        <PipelineStage 
          title="Quote Booked" 
          icon={<Calendar className="h-5 w-5 text-purple-600" />}
          count={getCustomersByStage('quoteBooked').length}
          color="bg-purple-100"
          customers={getCustomersByStage('quoteBooked')}
          onMoveCustomer={(id) => moveCustomer(id, 'quoteSent')}
          targetStageName="Quote Sent"
          onMoveToAlternative={(id) => moveCustomer(id, 'notServiceable')}
          alternativeStageName="Not Serviceable"
        />

        {/* Not Serviceable */}
        <PipelineStage 
          title="Not Serviceable" 
          icon={<X className="h-5 w-5 text-red-600" />}
          count={getCustomersByStage('notServiceable').length}
          color="bg-red-100"
          customers={getCustomersByStage('notServiceable')}
          onMoveCustomer={(id) => moveCustomer(id, 'new')}
          targetStageName="Reopen"
        />

        {/* Quote Sent */}
        <PipelineStage 
          title="Quote Sent" 
          icon={<FileText className="h-5 w-5 text-indigo-600" />}
          count={getCustomersByStage('quoteSent').length}
          color="bg-indigo-100"
          customers={getCustomersByStage('quoteSent')}
          onMoveCustomer={(id) => moveCustomer(id, 'followUp')}
          targetStageName="Follow Up"
        />

        {/* Auto Follow Up */}
        <PipelineStage 
          title="Auto Follow Up" 
          icon={<Clock className="h-5 w-5 text-amber-600" />}
          count={getCustomersByStage('followUp').length}
          color="bg-amber-100"
          customers={getCustomersByStage('followUp')}
          onMoveCustomer={(id) => moveCustomer(id, 'accepted')}
          targetStageName="Accepted"
          onMoveToAlternative={(id) => moveCustomer(id, 'denied')}
          alternativeStageName="Denied"
        />

        {/* Quote Denied */}
        <PipelineStage 
          title="Quote Denied" 
          icon={<X className="h-5 w-5 text-orange-600" />}
          count={getCustomersByStage('denied').length}
          color="bg-orange-100"
          customers={getCustomersByStage('denied')}
          onMoveCustomer={(id) => moveCustomer(id, 'new')}
          targetStageName="Reopen"
        />

        {/* Quote Accepted */}
        <PipelineStage 
          title="Quote Accepted" 
          icon={<CheckCircle className="h-5 w-5 text-green-600" />}
          count={getCustomersByStage('accepted').length}
          color="bg-green-100"
          customers={getCustomersByStage('accepted')}
          onMoveCustomer={(id) => moveCustomer(id, 'new')}
          targetStageName="New Quote"
        />
      </div>
    </div>
  );
};

interface PipelineStageProps {
  title: string;
  icon: React.ReactNode;
  count: number;
  color: string;
  customers: Array<{
    id: string;
    name: string;
    phone: string;
    lastMessage: string;
    timestamp: string;
  }>;
  onMoveCustomer: (id: string) => void;
  targetStageName: string;
  onMoveToAlternative?: (id: string) => void;
  alternativeStageName?: string;
}

const PipelineStage: React.FC<PipelineStageProps> = ({
  title,
  icon,
  count,
  color,
  customers,
  onMoveCustomer,
  targetStageName,
  onMoveToAlternative,
  alternativeStageName
}) => {
  return (
    <div className="w-[250px] flex-shrink-0">
      <Card className="h-full">
        <CardHeader className={`${color} py-2 px-3`}>
          <CardTitle className="text-sm flex items-center justify-between">
            <div className="flex items-center gap-2">
              {icon}
              <span>{title}</span>
            </div>
            <span className="bg-white text-gray-800 text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {count}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2 overflow-y-auto" style={{ maxHeight: '500px' }}>
          <div className="space-y-2">
            {customers.map(customer => (
              <CustomerCard 
                key={customer.id}
                customer={customer}
                onMoveCustomer={() => onMoveCustomer(customer.id)}
                targetStageName={targetStageName}
                onMoveToAlternative={onMoveToAlternative ? () => onMoveToAlternative(customer.id) : undefined}
                alternativeStageName={alternativeStageName}
              />
            ))}
            <Button 
              variant="ghost" 
              size="sm" 
              className="w-full border border-dashed border-gray-300 text-gray-500 hover:text-gray-700 hover:border-gray-400 mt-2"
            >
              <PlusCircle className="h-4 w-4 mr-1" />
              Add Customer
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface CustomerCardProps {
  customer: {
    id: string;
    name: string;
    phone: string;
    lastMessage: string;
    timestamp: string;
  };
  onMoveCustomer: () => void;
  targetStageName: string;
  onMoveToAlternative?: () => void;
  alternativeStageName?: string;
}

const CustomerCard: React.FC<CustomerCardProps> = ({
  customer,
  onMoveCustomer,
  targetStageName,
  onMoveToAlternative,
  alternativeStageName
}) => {
  return (
    <div className="bg-white border rounded-lg shadow-sm p-2 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gray-100 rounded-full p-1">
            <User className="h-4 w-4 text-gray-600" />
          </div>
          <div>
            <h4 className="font-medium text-sm">{customer.name}</h4>
            <p className="text-xs text-gray-500">{customer.phone}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">{customer.timestamp}</span>
      </div>
      
      <div className="mt-2 flex items-start gap-1">
        <MessageSquare className="h-3.5 w-3.5 text-gray-400 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-gray-600 line-clamp-2">{customer.lastMessage}</p>
      </div>
      
      <div className="mt-2 flex flex-wrap gap-1">
        <Button 
          variant="outline" 
          size="sm" 
          className="text-xs h-6 py-0 px-2 bg-slate-200 hover:bg-slate-300"
          onClick={onMoveCustomer}
        >
          {targetStageName}
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
        
        {onMoveToAlternative && alternativeStageName && (
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs h-6 py-0 px-2 bg-slate-200 hover:bg-slate-300"
            onClick={onMoveToAlternative}
          >
            {alternativeStageName}
            <ChevronRight className="h-3 w-3 ml-1" />
          </Button>
        )}
      </div>
    </div>
  );
};
