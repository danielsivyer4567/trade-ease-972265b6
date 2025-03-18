
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Toaster } from "@/components/ui/toaster";
import { QueryProvider } from '@/integrations/query/QueryProvider';
import { routes } from './routes';
import NotFound from './pages/NotFound';
import './App.css';

function App() {
  return (
    <QueryProvider>
      <BrowserRouter>
        <Routes>
          {routes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.element}
            />
          ))}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryProvider>
  );
}

export default App;
