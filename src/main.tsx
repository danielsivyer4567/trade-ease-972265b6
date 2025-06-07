import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { disableDevToolsOverlay } from './utils/disableDevToolsOverlay'
// Remove the startupService import to prevent the 404 error
// import { startupService } from './services/startupService'

// Disable React DevTools overlay to prevent message channel errors
disableDevToolsOverlay();

// Setup error handling for Vite HMR
if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    console.log('Vite HMR update detected');
  });

  import.meta.hot.on('error', (err) => {
    console.error('Vite HMR error detected:', err);
  });
}

// Create root with error handling
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('Root element not found');
} else {
  const root = ReactDOM.createRoot(rootElement);
  
  // Initialize app
  const renderApp = async () => {
    try {
      // No need to initialize the startup service - this was causing the 404 error
      // await startupService.initialize();
      
      // Render the app
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (error) {
      console.error('Error initializing app:', error);
      root.render(
        <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
          <h1 style={{ color: 'red' }}>Application Error</h1>
          <p>The application failed to initialize. Please check the console for details.</p>
          <button 
            style={{ 
              padding: '8px 16px', 
              backgroundColor: '#f44336', 
              color: 'white', 
              border: 'none', 
              borderRadius: '4px',
              cursor: 'pointer',
              marginTop: '16px'
            }}
            onClick={() => window.location.reload()}
          >
            Reload Application
          </button>
        </div>
      );
    }
  };
  
  // Start the application
  renderApp();
}
