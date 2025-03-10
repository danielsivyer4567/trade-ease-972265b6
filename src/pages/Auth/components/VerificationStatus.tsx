
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertCircle } from 'lucide-react';

interface VerificationStatusProps {
  status: 'idle' | 'success' | 'error';
  message: string;
  navigate: (path: string) => void;
}

const VerificationStatus: React.FC<VerificationStatusProps> = ({ status, message, navigate }) => {
  if (status === 'idle') {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-16 h-16" />
          </div>
          <CardTitle className="text-center">Email Verification</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {status === 'success' ? (
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-semibold">{message}</p>
              <Button 
                onClick={() => navigate('/auth')} 
                className="mt-6 bg-slate-700 hover:bg-slate-800"
              >
                Go to Sign In
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-xl font-semibold">{message}</p>
              <Button 
                onClick={() => navigate('/auth')} 
                className="mt-6 bg-slate-700 hover:bg-slate-800"
              >
                Go to Sign In
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerificationStatus;
