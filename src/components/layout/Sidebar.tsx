import React from 'react';
import { 
  Compass, 
  Map, 
  Globe, 
  Activity as ActivityIcon, 
  PieChart, 
  Calendar, 
  User, 
  ShieldAlert, 
  PlusCircle, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Compass size={19} /> },
    { id: 'my-trips', label: 'My Trips', icon: <Map size={19} /> },
    { id: 'builder', label: 'Itinerary Builder', icon: <PlusCircle size={19} /> },
    { id: 'cities', label: 'Explore Cities', icon: <Globe size={19} /> },
    { id: 'activities', label: 'Activities', icon: <ActivityIcon size={19} /> },
    { id: 'budget', label: 'Budget & Cost', icon: <PieChart size={19} /> },
    { id: 'calendar', label: 'Calendar & Timeline', icon: <Calendar size={19} /> },
    { id: 'profile', label: 'Profile & Settings', icon: <User size={19} /> },
    { id: 'admin', label: 'Admin Analytics', icon: <ShieldAlert size={19} />, role: 'admin' },
  ];

  return (
    <aside className="app-sidebar">
      {/* Brand Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.75rem', padding: '0.2rem 0.4rem' }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          boxShadow: '0 4px 12px rgba(184, 91, 61, 0.25)'
        }}>
          <Compass size={22} />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', lineHeight: 1.1 }}>GlobeTrotter</h2>
          <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Travel Journal</span>
        </div>
      </div>

      {/* Primary Action Button */}
      <button 
        className="btn btn-primary" 
        onClick={() => setActiveTab('create-trip')}
        style={{ width: '100%', marginBottom: '1.5rem', justifyContent: 'center' }}
      >
        <PlusCircle size={17} />
        <span>Plan New Trip</span>
      </button>

      {/* Navigation List */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flex: 1 }}>
        {navItems.map(item => {
          if (item.role && user?.role !== item.role) return null;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                color: isActive ? 'var(--primary)' : 'var(--text-secondary)',
                backgroundColor: isActive ? 'var(--primary-light)' : 'transparent',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.9rem',
                transition: 'all 0.15s ease',
                borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
              }}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Footer Card */}
      <div style={{
        marginTop: 'auto',
        paddingTop: '0.85rem',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
          <img
            src={user?.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'}
            alt={user?.name}
            style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover', border: '1px solid var(--border-color)' }}
          />
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontSize: '0.825rem', fontWeight: 700, color: 'var(--text-primary)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.name || 'Traveler'}
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {user?.email}
            </div>
          </div>
        </div>
        <button
          onClick={logout}
          title="Log out"
          style={{ color: 'var(--text-muted)', padding: '0.35rem', borderRadius: '6px' }}
        >
          <LogOut size={17} />
        </button>
      </div>
    </aside>
  );
};
