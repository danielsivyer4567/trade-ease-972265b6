import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

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
  
  try {
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Error rendering app:', error);
    root.render(
      <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
        <h1 style={{ color: 'red' }}>Application Error</h1>
        <p>The application failed to initialize. Please check the console for details.</p>
      </div>
    );
  }
}
