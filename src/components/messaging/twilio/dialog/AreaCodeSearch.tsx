
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, RefreshCw } from "lucide-react";

interface AreaCodeSearchProps {
  areaCode: string;
  setAreaCode: (value: string) => void;
  isLoadingNumbers: boolean;
  fetchAvailableNumbers: () => void;
}

export const AreaCodeSearch = ({
  areaCode,
  setAreaCode,
  isLoadingNumbers,
  fetchAvailableNumbers
}: AreaCodeSearchProps) => {
  return (
    <div className="flex gap-2 items-end">
      <div className="flex-1">
        <Label htmlFor="area-code">Area Code (Optional)</Label>
        <Input 
          id="area-code"
          placeholder="e.g. 510" 
          value={areaCode} 
          onChange={(e) => setAreaCode(e.target.value)}
          maxLength={3}
        />
      </div>
      <Button 
        onClick={fetchAvailableNumbers} 
        disabled={isLoadingNumbers}
        className="bg-slate-400 hover:bg-slate-300"
      >
        {isLoadingNumbers ? (
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
        ) : (
          <RefreshCw className="h-4 w-4 mr-2" />
        )}
        {isLoadingNumbers ? "Loading..." : "Refresh"}
      </Button>
    </div>
  );
};
