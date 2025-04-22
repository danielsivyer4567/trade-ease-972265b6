import React from 'react';

const Dashboard: React.FC = () => {
  return (
    <div className="flex flex-col gap-5 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="p-6 bg-white rounded shadow">
          <div className="pb-2">
            <div className="text-sm font-medium">Active Jobs</div>
          </div>
          <div>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-gray-500">+3 since last month</p>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded shadow">
          <div className="pb-2">
            <div className="text-sm font-medium">Pending Quotes</div>
          </div>
          <div>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-gray-500">-2 since last month</p>
          </div>
        </div>
        
        <div className="p-6 bg-white rounded shadow">
          <div className="pb-2">
            <div className="text-sm font-medium">Revenue (Month)</div>
          </div>
          <div>
            <div className="text-2xl font-bold">$24,250</div>
            <p className="text-xs text-gray-500">+15.2% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 