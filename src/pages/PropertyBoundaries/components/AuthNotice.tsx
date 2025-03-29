
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const AuthNotice: React.FC = () => {
  return (
    <Alert className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Authentication Required</AlertTitle>
      <AlertDescription className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <span>Log in to save your property boundaries.</span>
        <Button asChild size="sm" variant="outline">
          <Link to="/auth">Log In or Sign Up</Link>
        </Button>
      </AlertDescription>
    </Alert>
  );
};
