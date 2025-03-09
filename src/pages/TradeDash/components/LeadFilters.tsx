import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TRADE_TYPES } from "../constants";
interface SavedFilter {
  name: string;
  active: boolean;
}
interface FiltersProps {
  filters: {
    postcode: string;
    minSize: string;
    maxBudget: string;
    leadType: string;
    tradeType: string;
  };
  savedFilters: SavedFilter[];
  onFilterChange: (field: string, value: string) => void;
  onSavedFilterToggle: (index: number) => void;
}
export const LeadFilters: React.FC<FiltersProps> = ({
  filters,
  savedFilters,
  onFilterChange,
  onSavedFilterToggle
}) => {
  return;
};