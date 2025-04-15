
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MoreHorizontal, Printer, Mail, Download } from "lucide-react";

interface PurchaseOrderHeaderProps {
  selectedTab: string;
  onTabChange: (value: string) => void;
}

export function PurchaseOrderHeader({ selectedTab, onTabChange }: PurchaseOrderHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-4">
        <Tabs value={selectedTab} onValueChange={onTabChange} className="w-full">
          <TabsList>
            <TabsTrigger value="draft">Draft P/O (2)</TabsTrigger>
            <TabsTrigger value="unbilled">Unbilled P/O</TabsTrigger>
            <TabsTrigger value="billed">Billed P/O (3)</TabsTrigger>
            <TabsTrigger value="all">All P/O (5)</TabsTrigger>
            <TabsTrigger value="draft-bills">Draft Bills (2)</TabsTrigger>
            <TabsTrigger value="approved">Approved Bills (234)</TabsTrigger>
            <TabsTrigger value="all-bills">All Bills (252)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Printer className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Mail className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
