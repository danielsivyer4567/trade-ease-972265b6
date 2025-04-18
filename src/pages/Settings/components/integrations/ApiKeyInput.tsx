import React from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Key, Loader2 } from "lucide-react";

interface ApiKeyInputProps {
  integration: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({
  integration,
  value,
  onChange,
  onSubmit,
  isLoading
}) => {
  // Customize label and placeholder based on integration
  const getLabelText = () => {
    if (integration === "Xero") {
      return "Client Secret";
    }
    return "API Key";
  };

  const getPlaceholderText = () => {
    if (integration === "Xero") {
      return "Enter your Xero Client Secret";
    }
    return "Enter API key";
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={`${integration}-api-key`} className="text-sm">{getLabelText()}</Label>
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          id={`${integration}-api-key`}
          type="password"
          placeholder={getPlaceholderText()}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="text-sm h-9"
          disabled={isLoading}
        />
        <Button 
          onClick={onSubmit}
          disabled={isLoading || !value}
          className="h-9 text-xs whitespace-nowrap"
          size="sm"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Key className="h-3 w-3 mr-1" />
              Save Key
            </>
          )}
        </Button>
      </div>
    </div>
  );
};
