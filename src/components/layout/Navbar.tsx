import React, { useState, useEffect } from 'react';
import { Compass, Share2, Sun, Moon, MapPin } from 'lucide-react';
import { useTrips } from '../../context/TripContext';
import { useAuth } from '../../context/AuthContext';
import { profileService } from '../../services/api/profileService';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab }) => {
  const { activeTrip, trips, setActiveTripId } = useTrips();
  const { user, updateProfileState } = useAuth();
  
  // Theme state synced with documentElement and localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('globetrotter_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return user?.preferences?.theme || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('globetrotter_theme', theme);
  }, [theme]);

  // Sync theme when user preferences load
  useEffect(() => {
    if (user?.preferences?.theme) {
      setTheme(user.preferences.theme);
    }
  }, [user?.preferences?.theme]);

  const toggleTheme = () => {
    const newTheme: 'light' | 'dark' = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('globetrotter_theme', newTheme);

    if (user) {
      const updated = {
        ...user,
        preferences: { ...user.preferences, theme: newTheme }
      };
      updateProfileState(updated);
      profileService.updateProfile({ preferences: updated.preferences }).catch(console.error);
    }
  };

  const getPageTitle = (tab: string) => {
    switch (tab) {
      case 'dashboard': return 'Dashboard & Travel Journal';
      case 'my-trips': return 'My Trips';
      case 'create-trip': return 'Plan a New Journey';
      case 'builder': return 'Itinerary Builder';
      case 'itinerary-view': return 'Trip Itinerary View';
      case 'cities': return 'Explore Destinations';
      case 'activities': return 'Things to Do & Activities';
      case 'budget': return 'Trip Budget & Cost Breakdown';
      case 'calendar': return 'Trip Calendar & Timeline';
      case 'shared': return 'Shared Public Itinerary';
      case 'profile': return 'User Profile & Settings';
      case 'admin': return 'Admin & Platform Analytics';
      default: return 'GlobeTrotter';
    }
  };

  return (
    <header className="top-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile Logo */}
        <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={22} style={{ color: 'var(--primary)' }} />
          <span style={{ fontWeight: 700, fontSize: '1.05rem', fontFamily: 'Playfair Display, Georgia, serif' }}>GlobeTrotter</span>
        </div>
        <h1 style={{ fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)', display: 'none' }} className="desktop-title">
          {getPageTitle(activeTab)}
        </h1>
      </div>

      {/* Active Trip Selector Dropdown */}
      {trips.length > 0 && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          background: 'var(--bg-input)',
          padding: '0.35rem 0.8rem',
          borderRadius: 'var(--radius-full)',
          border: '1px solid var(--border-color)'
        }}>
          <MapPin size={15} style={{ color: 'var(--primary)' }} />
          <select
            value={activeTrip?.id || ''}
            onChange={(e) => setActiveTripId(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              outline: 'none',
              cursor: 'pointer'
            }}
          >
            {trips.map(t => (
              <option key={t.id} value={t.id} style={{ background: 'var(--bg-card)', color: 'var(--text-primary)' }}>
                {t.name} ({t.stops.length} stops)
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Header Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        {activeTrip && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setActiveTab('shared')}
            title="Share Itinerary"
          >
            <Share2 size={15} />
            <span style={{ display: 'none' }} className="desktop-title">Share</span>
          </button>
        )}

        <button
          onClick={toggleTheme}
          style={{
            padding: '0.45rem',
            borderRadius: '50%',
            background: 'var(--bg-input)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Toggle Dark/Light Mode"
        >
          {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
        </button>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-title { display: block !important; }
          .mobile-only { display: none !important; }
        }
      `}</style>
    </header>
  );
};
