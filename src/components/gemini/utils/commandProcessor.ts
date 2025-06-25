import { toast } from "sonner";

export const processCommand = (text: string) => {
  const lowerText = text.toLowerCase();

  // Check for screen share / AI help commands
  if (lowerText.includes("screen share") || 
      lowerText.includes("share screen") || 
      lowerText.includes("ai help") || 
      lowerText.includes("help with n8n") ||
      lowerText.includes("n8n assistant")) {
    window.location.href = "/n8n-assistant";
    toast.success("Opening AI Screen Share Assistant");
    return;
  }

  if (lowerText.includes("go to") || lowerText.includes("navigate to")) {
    const destination = extractDestination(lowerText);
    if (destination) {
      navigateTo(destination);
    }
  } else if (lowerText.includes("create") || lowerText.includes("new")) {
    if (lowerText.includes("job")) {
      window.location.href = "/jobs/new";
    } else if (lowerText.includes("customer")) {
      window.location.href = "/customers/new";
    } else if (lowerText.includes("quote")) {
      window.location.href = "/quotes/new";
    } else if (lowerText.includes("workflow")) {
      window.location.href = "/workflow";
    }
  } else if (lowerText.includes("search")) {
    toast.info("Search functionality coming soon!");
  } else if (lowerText.includes("calculator") || lowerText.includes("calculators")) {
    window.location.href = "/calculators";
    toast.success("Navigating to Calculators");
  } else {
    toast.info("Command not recognized. Try saying 'Go to Jobs' or 'Create new customer'");
  }
};

export const extractDestination = (text: string): string | null => {
  const goToMatch = text.match(/go to\s+(\w+)/i);
  const navigateToMatch = text.match(/navigate to\s+(\w+)/i);
  if (goToMatch && goToMatch[1]) {
    return goToMatch[1];
  } else if (navigateToMatch && navigateToMatch[1]) {
    return navigateToMatch[1];
  }
  return null;
};

export const navigateTo = (destination: string) => {
  const destinations: Record<string, string> = {
    dashboard: "/",
    home: "/",
    jobs: "/jobs",
    customers: "/customers",
    quotes: "/quotes",
    workflow: "/workflow",
    settings: "/settings",
    calendar: "/calendar",
    team: "/teams",
    expenses: "/expenses",
    banking: "/banking",
    inventory: "/inventory",
    calculators: "/calculators",
    calculator: "/calculators",
    "n8n-assistant": "/n8n-assistant",
    "ai-help": "/n8n-assistant",
    "screen-share": "/n8n-assistant"
  };
  const url = destinations[destination.toLowerCase()];
  if (url) {
    window.location.href = url;
    toast.success(`Navigating to ${destination}`);
  } else {
    toast.warning(`Unknown destination: ${destination}`);
  }
};
