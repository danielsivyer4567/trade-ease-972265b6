
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Plus, DollarSign, FileText, CalendarIcon } from "lucide-react";

export function DashboardHeader() {
  return (
    <div className="flex flex-col items-center justify-center text-center mb-4 md:mb-8">
      <div className="flex items-center gap-2 mb-4">
        <img src="/lovable-uploads/6a07dd00-f2c7-49da-8b00-48d960c13610.png" alt="Trade Ease Logo" className="w-8 h-8" />
        <h1 className="text-xl md:text-2xl text-gray-900 mx-[7px] my-0 px-0 py-0 font-extrabold">Managers Dashboard</h1>
      </div>
      <div className="flex flex-wrap gap-1.5 md:gap-2 justify-center mt-4 md:mt-6 w-full max-w-screen-lg">
        <Button
          asChild
          className="bg-blue-600 hover:bg-blue-700 text-xs md:text-sm flex-grow md:flex-grow-0"
        >
          <Link to="/jobs/new">New Job</Link>
        </Button>
        <Button
          asChild
          size="sm"
          className="bg-green-600 hover:bg-green-700 text-xs md:text-sm flex-grow md:flex-grow-0"
        >
          <Link to="/quotes/new" className="flex items-center">
            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1" /> New Quote
          </Link>
        </Button>
        <Button size="sm" className="bg-purple-600 hover:bg-purple-700 text-xs md:text-sm flex-grow md:flex-grow-0">
          <Link to="/customers/new" className="flex items-center">
            <Plus className="w-3 h-3 md:w-4 md:h-4 mr-1" /> New Customer
          </Link>
        </Button>
        <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs md:text-sm flex-grow md:flex-grow-0">
          <Link to="/payments/new" className="flex items-center">
            <DollarSign className="w-3 h-3 md:w-4 md:h-4 mr-1" /> New Payment
          </Link>
        </Button>
        <Button size="sm" className="bg-orange-600 hover:bg-orange-700 text-xs md:text-sm flex-grow md:flex-grow-0">
          <Link to="/payroll/pay-run" className="flex items-center">
            <CalendarIcon className="w-3 h-3 md:w-4 md:h-4 mr-1" /> Pay Run
          </Link>
        </Button>
        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-xs md:text-sm flex-grow md:flex-grow-0">
          <Link to="/invoices/new" className="flex items-center">
            <FileText className="w-3 h-3 md:w-4 md:h-4 mr-1" /> New Invoice
          </Link>
        </Button>
      </div>
    </div>
  );
}
