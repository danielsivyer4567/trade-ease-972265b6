
import { createBrowserRouter, RouterProvider } from "react-router-dom";
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
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}

export default App;
