
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from 'react';
import Index from "./pages/Index";
import NewCustomer from "./pages/Customers/NewCustomer";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "./pages/NotFound";
import "./App.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
  },
  {
    path: "/customers/new",
    element: <NewCustomer />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

function App() {
  return (
    <React.StrictMode>
      <RouterProvider router={router} />
      <Toaster />
    </React.StrictMode>
  );
}

export default App;
