import React from 'react';
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
interface ConnectedPhonesListProps {
  connectedNumbers: string[];
  onRemoveNumber: (index: number) => void;
  onAddTwilioAccount: () => void;
}
export const ConnectedPhonesList = ({
  connectedNumbers,
  onRemoveNumber,
  onAddTwilioAccount
}: ConnectedPhonesListProps) => {
  return;
};