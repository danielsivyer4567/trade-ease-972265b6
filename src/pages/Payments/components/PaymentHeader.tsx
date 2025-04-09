
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function PaymentHeader() {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center gap-2 mb-6">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => navigate(-1)} 
        className="rounded-md border border-gray-300 px-3 py-1 bg-[#D3E4FD] hover:bg-[#B5D1F8] text-[#1E40AF] hover:text-[#1E3A8A]"
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
      </Button>
      <h1 className="text-xl sm:text-2xl font-bold">New Payment</h1>
    </div>
  );
}
