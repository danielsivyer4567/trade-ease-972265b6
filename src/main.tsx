
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeTables } from './integrations/supabase/dbInit.ts'

// Initialize database tables on app start
initializeTables().then(result => {
  if (result.success) {
    console.log('Database tables initialized successfully');
  } else {
    console.warn('Table initialization issues:', result.error);
    // Continue loading the app anyway, since some tables might exist
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
