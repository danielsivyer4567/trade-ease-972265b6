
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const AuthNotice = () => {
  const navigate = useNavigate();

  return (
    <Alert>
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Authentication Required</AlertTitle>
      <AlertDescription className="flex items-center gap-4">
        <span>Please log in to save and manage property boundaries.</span>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate('/auth')}
        >
          Log In
        </Button>
      </AlertDescription>
    </Alert>
  );
};
