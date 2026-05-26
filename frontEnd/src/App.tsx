import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './router/AppRouter';
import { NotificationProvider } from './components/NotificationContainer';
import { AuthProvider } from './context/AuthContext';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <BrowserRouter>
          <AuthProvider>
          <AppRouter />
          </AuthProvider>
      </BrowserRouter>
      </NotificationProvider>
    </QueryClientProvider>
  );
}
