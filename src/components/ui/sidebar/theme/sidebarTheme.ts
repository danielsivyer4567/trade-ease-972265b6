
import { cva } from "class-variance-authority";

// Main sidebar container
export const sidebarVariants = cva(
  "relative flex flex-col border-r transition-all duration-300 ease-in-out",
  {
    variants: {
      theme: {
        default: "bg-[#E2E8F0] border-[#B8C5D5]",
        dark: "bg-gray-900 border-gray-800 text-gray-100",
        light: "bg-white border-gray-200",
        blue: "bg-blue-50 border-blue-200",
        purple: "bg-purple-50 border-purple-200",
        green: "bg-green-50 border-green-200",
      },
      size: {
        expanded: "w-[240px]",
        collapsed: "w-[64px]",
      },
    },
    defaultVariants: {
      theme: "default",
      size: "expanded",
    },
  }
);

// Sidebar header
export const sidebarHeaderVariants = cva(
  "flex items-center border-b h-16 px-4",
  {
    variants: {
      theme: {
        default: "bg-[#E2E8F0] border-[#B8C5D5]",
        dark: "bg-gray-900 border-gray-800",
        light: "bg-white border-gray-200",
        blue: "bg-blue-100 border-blue-200",
        purple: "bg-purple-100 border-purple-200",
        green: "bg-green-100 border-green-200",
      },
    },
    defaultVariants: {
      theme: "default",
    },
  }
);

// Navigation items
export const navItemVariants = cva(
  "flex items-center rounded-lg transition-colors",
  {
    variants: {
      theme: {
        default: "text-gray-950 hover:bg-white hover:text-primary",
        dark: "text-gray-200 hover:bg-gray-800 hover:text-white",
        light: "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
        blue: "text-blue-900 hover:bg-blue-100 hover:text-blue-700",
        purple: "text-purple-900 hover:bg-purple-100 hover:text-purple-700",
        green: "text-green-900 hover:bg-green-100 hover:text-green-700",
      },
      active: {
        true: "",
        false: "",
      }
    },
    compoundVariants: [
      {
        theme: "default",
        active: true,
        className: "bg-white text-primary border border-foreground/10",
      },
      {
        theme: "dark",
        active: true,
        className: "bg-gray-800 text-white border border-gray-700",
      },
      {
        theme: "light",
        active: true,
        className: "bg-gray-100 text-gray-900 border border-gray-200",
      },
      {
        theme: "blue",
        active: true,
        className: "bg-blue-100 text-blue-700 border border-blue-200",
      },
      {
        theme: "purple",
        active: true,
        className: "bg-purple-100 text-purple-700 border border-purple-200",
      },
      {
        theme: "green",
        active: true,
        className: "bg-green-100 text-green-700 border border-green-200",
      },
    ],
    defaultVariants: {
      theme: "default",
      active: false,
    },
  }
);

// Navigation group labels
export const groupLabelVariants = cva("font-extrabold text-base px-2 mb-2", {
  variants: {
    theme: {
      default: "text-gray-950",
      dark: "text-gray-300",
      light: "text-gray-700",
      blue: "text-blue-800",
      purple: "text-purple-800",
      green: "text-green-800",
    },
  },
  defaultVariants: {
    theme: "default",
  },
});

// Icon colors
export const iconVariants = cva("h-4 w-4", {
  variants: {
    theme: {
      default: "text-muted-foreground",
      dark: "text-gray-400",
      light: "text-gray-500",
      blue: "text-blue-500",
      purple: "text-purple-500",
      green: "text-green-500",
    },
    active: {
      true: "",
      false: "",
    }
  },
  compoundVariants: [
    {
      theme: "default",
      active: true,
      className: "text-primary",
    },
    {
      theme: "dark",
      active: true,
      className: "text-white",
    },
    {
      theme: "light",
      active: true,
      className: "text-gray-900",
    },
    {
      theme: "blue",
      active: true,
      className: "text-blue-700",
    },
    {
      theme: "purple",
      active: true,
      className: "text-purple-700",
    },
    {
      theme: "green",
      active: true,
      className: "text-green-700",
    },
  ],
  defaultVariants: {
    theme: "default",
    active: false,
  },
});

// Types
export type SidebarTheme = "default" | "dark" | "light" | "blue" | "purple" | "green";
