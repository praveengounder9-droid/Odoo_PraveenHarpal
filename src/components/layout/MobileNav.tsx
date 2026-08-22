import React from 'react';
import { Compass, Map, Globe, PieChart, User } from 'lucide-react';

interface MobileNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Explore', icon: <Compass size={19} /> },
    { id: 'my-trips', label: 'Trips', icon: <Map size={19} /> },
    { id: 'cities', label: 'Cities', icon: <Globe size={19} /> },
    { id: 'budget', label: 'Budget', icon: <PieChart size={19} /> },
    { id: 'profile', label: 'Profile', icon: <User size={19} /> },
  ];

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '58px',
      background: 'rgba(250, 249, 245, 0.92)',
      backdropFilter: 'blur(16px)',
      borderTop: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 50,
    }} className="mobile-nav-container">
      {navItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.15rem',
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              fontSize: '0.7rem',
              fontWeight: isActive ? 700 : 500
            }}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        );
      })}
      <style>{`
        @media (min-width: 1025px) {
          .mobile-nav-container { display: none !important; }
        }
      `}</style>
    </div>
  );
};
