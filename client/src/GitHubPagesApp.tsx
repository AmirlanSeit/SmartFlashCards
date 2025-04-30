import React from 'react';
import ReactDOM from 'react-dom/client';
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import StaticSinglePageApp from '@/pages/StaticSinglePageApp';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="math-flashcards-theme">
      <StaticSinglePageApp />
      <Toaster />
    </ThemeProvider>
  </React.StrictMode>,
);