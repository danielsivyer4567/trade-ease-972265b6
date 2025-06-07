import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";

// Main component exported as Component
function Component() {
  return (
    <Button variant="destructive" size="sm" className="rounded-full px-3 py-1">
      <Trash className="-ms-0.5 me-1.5 opacity-80" size={14} strokeWidth={2} aria-hidden="true" />
      Delete
    </Button>
  );
}

// Header variant exported separately for use in the header
export function HeaderVariant() {
  return (
    <Button variant="destructive" size="sm" className="rounded-full">
      <Trash className="h-4 w-4" />
    </Button>
  );
}

export { Component }; 