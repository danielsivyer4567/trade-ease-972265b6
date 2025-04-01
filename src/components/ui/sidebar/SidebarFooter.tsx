
import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const SidebarFooter = React.forwardRef<HTMLDivElement, React.ComponentProps<"div">>(
  ({ className, ...props }, ref) => {
    const { signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
      try {
        await signOut();
        toast.success("Logged out successfully");
        navigate("/auth");
      } catch (error) {
        console.error("Error logging out:", error);
        toast.error("Failed to log out");
      }
    };

    return (
      <div
        ref={ref}
        data-sidebar="footer"
        className={cn("flex flex-col gap-2 p-4 border-t border-[#B8C5D5]", className)}
        {...props}
      >
        <Button
          variant="ghost"
          size="sm"
          className="justify-start w-full text-muted-foreground hover:text-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Log out
        </Button>
      </div>
    );
  }
);
SidebarFooter.displayName = "SidebarFooter";
