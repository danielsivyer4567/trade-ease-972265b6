import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { LoadScript } from '@react-google-maps/api'
import { disableDevToolsOverlay } from './utils/disableDevToolsOverlay'
import { workflowJobProcessor } from './services/WorkflowJobProcessor'
import './utils/errorHandler'
import './utils/startupDiagnostics'
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css'

disableDevToolsOverlay()

if (import.meta.hot) {
  import.meta.hot.on('vite:beforeUpdate', () => {
    console.log('Vite HMR update detected')
  })

  import.meta.hot.on('error', (err) => {
    console.error('Vite HMR error detected:', err)
  })
}

const originalFetch = window.fetch
window.fetch = function (input, init) {
  return originalFetch(input, init).catch((error) => {
    if (error.message && error.message.includes('CORS')) {
      console.error('CORS Error Details:', {
        url: typeof input === 'string' ? input : input instanceof Request ? input.url : String(input),
        method: init?.method || (input instanceof Request ? input.method : 'GET'),
        headers: init?.headers || (input instanceof Request ? input.headers : undefined),
        mode: init?.mode || 'cors',
        error: error.message,
      })
    }
    throw error
  })
}

if (import.meta.env.MODE === 'development') {
  workflowJobProcessor.start()
  console.log('Workflow job processor started in development mode')
}

const rootElement = document.getElementById('root')
if (!rootElement) {
  throw new Error('Root element not found. Make sure you have a div with id="root" in your index.html')
}

const root = ReactDOM.createRoot(rootElement)

const renderApp = () => {
  try {
    root.render(
      <React.StrictMode>
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={['places']}
        >
          <App />
        </LoadScript>
      </React.StrictMode>
    )
  } catch (error) {
    console.error('Error rendering app:', error)
    root.render(
      <div style={{ padding: '20px', fontFamily: 'system-ui' }}>
        <h1 style={{ color: 'red' }}>Application Error</h1>
        <p>The application failed to initialize. Please check the console for details.</p>
        <pre
          style={{
            backgroundColor: '#f5f5f5',
            padding: '10px',
            borderRadius: '4px',
            overflow: 'auto',
          }}
        >
          {error instanceof Error ? error.message : String(error)}
        </pre>
        <button
          style={{
            padding: '8px 16px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '16px',
          }}
          onClick={() => window.location.reload()}
        >
          Reload Application
        </button>
      </div>
    )
  }
}

renderApp()
