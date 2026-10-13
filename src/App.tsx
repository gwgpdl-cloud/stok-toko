import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StockPage from './pages/StockPage';
import ReportPage from './pages/ReportPage';
import ScannerPage from './pages/ScannerPage';
import Navigation from './components/Navigation';

function AppContent() {
  const { user, currentPage } = useApp();

  if (!user) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <DashboardPage />;
      case 'stock':
        return <StockPage />;
      case 'report':
        if (user.role !== 'admin') return <DashboardPage />;
        return <ReportPage />;
      case 'scanner':
        return <ScannerPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      {/* Mobile Layout */}
      <main className="md:hidden">
        {renderPage()}
      </main>
      {/* Desktop Layout */}
      <main className="hidden md:block md:ml-64">
        {renderPage()}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
