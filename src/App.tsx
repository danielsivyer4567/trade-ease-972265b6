
import { Routes } from "./routes";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./components/notifications/NotificationContextProvider";
import { BrowserRouter } from "react-router-dom";

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Toaster />
        <BrowserRouter>
          <Routes />
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
