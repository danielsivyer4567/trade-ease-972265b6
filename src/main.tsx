
import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from './App.tsx';
import './index.css';

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element not found");
}

// Add React.StrictMode only in development to prevent double renders in production
const StrictModeWrapper = process.env.NODE_ENV === 'development' 
  ? React.StrictMode 
  : React.Fragment;

createRoot(rootElement).render(
  <StrictModeWrapper>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictModeWrapper>
);
