import React from 'react';
import { AppLayout } from './AppLayout';
import { Button } from './button';
import { useNavigate } from 'react-router-dom';

interface StubPageProps {
  title: string;
  description?: string;
}

export const StubPage: React.FC<StubPageProps> = ({ 
  title, 
  description = "This page is under development. Check back soon for updates."
}) => {
  const navigate = useNavigate();
  
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">{title}</h1>
          <p className="text-gray-600 mb-6">{description}</p>
          <div className="flex justify-center space-x-4">
            <Button 
              variant="outline" 
              onClick={() => navigate(-1)}
            >
              Go Back
            </Button>
            <Button 
              onClick={() => navigate('/')}
            >
              Dashboard
            </Button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}; 