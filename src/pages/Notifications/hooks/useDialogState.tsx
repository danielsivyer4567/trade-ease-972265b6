
import { useState } from 'react';

export const useDialogState = () => {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false);
  const [isWebEnquiryDialogOpen, setIsWebEnquiryDialogOpen] = useState(false);

  return {
    isEmailDialogOpen,
    setIsEmailDialogOpen,
    isWebEnquiryDialogOpen,
    setIsWebEnquiryDialogOpen
  };
};
