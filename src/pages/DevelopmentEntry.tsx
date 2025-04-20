import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Development entry point to help troubleshoot routing issues
 */
export const DevelopmentEntry = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Development Mode</h1>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <p className="text-yellow-700">
          This is a troubleshooting page to help debug routing issues. 
          Select a route below to test specific components.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <LinkCard to="/" title="Dashboard" />
        <LinkCard to="/auth" title="Authentication" />
        <LinkCard to="/settings" title="Settings" />
        <LinkCard to="/customers" title="Customers" />
        <LinkCard to="/jobs" title="Jobs" />
      </div>
    </div>
  );
};

const LinkCard = ({ to, title }: { to: string; title: string }) => (
  <Link 
    to={to}
    className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors"
  >
    <h2 className="font-medium">{title}</h2>
    <p className="text-sm text-gray-500">Navigate to {to}</p>
  </Link>
);

export default DevelopmentEntry; 