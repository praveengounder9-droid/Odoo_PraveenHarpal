import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TripProvider, useTrips } from './context/TripContext';

// Layout
import { Sidebar } from './components/layout/Sidebar';
import { Navbar } from './components/layout/Navbar';
import { MobileNav } from './components/layout/MobileNav';

// Pages
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { CreateTripPage } from './pages/CreateTripPage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ItineraryBuilderPage } from './pages/ItineraryBuilderPage';
import { ItineraryViewPage } from './pages/ItineraryViewPage';
import { CitySearchPage } from './pages/CitySearchPage';
import { ActivitySearchPage } from './pages/ActivitySearchPage';
import { BudgetPage } from './pages/BudgetPage';
import { CalendarTimelinePage } from './pages/CalendarTimelinePage';
import { SharedItineraryPage } from './pages/SharedItineraryPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

const MainAppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const { setActiveTripId } = useTrips();
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'var(--bg-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--primary)',
        fontFamily: 'Outfit, sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', marginBottom: '0.5rem' }}>GlobeTrotter</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading application session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} onSelectTrip={id => { setActiveTripId(id); setActiveTab('itinerary-view'); }} />;
      case 'my-trips':
        return <MyTripsPage setActiveTab={setActiveTab} />;
      case 'create-trip':
        return <CreateTripPage setActiveTab={setActiveTab} />;
      case 'builder':
        return <ItineraryBuilderPage setActiveTab={setActiveTab} />;
      case 'itinerary-view':
        return <ItineraryViewPage setActiveTab={setActiveTab} />;
      case 'cities':
        return <CitySearchPage setActiveTab={setActiveTab} />;
      case 'activities':
        return <ActivitySearchPage setActiveTab={setActiveTab} />;
      case 'budget':
        return <BudgetPage setActiveTab={setActiveTab} />;
      case 'calendar':
        return <CalendarTimelinePage setActiveTab={setActiveTab} />;
      case 'shared':
        return <SharedItineraryPage setActiveTab={setActiveTab} />;
      case 'profile':
        return <ProfilePage />;
      case 'admin':
        return <AdminDashboardPage />;
      default:
        return <DashboardPage setActiveTab={setActiveTab} onSelectTrip={id => { setActiveTripId(id); setActiveTab('itinerary-view'); }} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="app-main">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <main className="content-area">
          {renderActiveScreen()}
        </main>
      </div>

      <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <TripProvider>
        <MainAppContent />
      </TripProvider>
    </AuthProvider>
  );
}

export default App;
