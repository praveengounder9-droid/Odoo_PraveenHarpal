import React, { useState, useEffect } from 'react';
import { ShieldAlert } from 'lucide-react';
import { adminService } from '../services/api/adminService';
import type { AdminStats } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);

  useEffect(() => {
    adminService.getAdminStats().then(setStats);
  }, []);

  if (!stats) return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading analytics...</div>;

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(126, 108, 143, 0.1)', color: 'var(--accent-purple)', padding: '0.3rem 0.75rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
          <ShieldAlert size={14} /> Platform Control Center
        </div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>Admin & Platform Analytics</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Track user acquisition, trip creation trends, and top destinations across GlobeTrotter.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.2rem', background: '#FFFFFF' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Registered Users</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            {stats.totalUsers.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)' }}>+14.2% this month</span>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', background: '#FFFFFF' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Total Trips Planned</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary)', marginTop: '0.2rem' }}>
            {stats.totalTrips.toLocaleString()}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--accent-teal)' }}>+22.8% active creation</span>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', background: '#FFFFFF' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Most Popular City</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-gold)', marginTop: '0.2rem' }}>
            {stats.popularCities[0]?.cityName}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stats.popularCities[0]?.count.toLocaleString()} stops added</span>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', background: '#FFFFFF' }}>
          <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Top Activity Category</div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-sunset)', marginTop: '0.2rem' }}>
            {stats.popularCategories[0]?.category}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{stats.popularCategories[0]?.count.toLocaleString()} bookings</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }} className="admin-grid">
        
        <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Top Booked Destinations
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.popularCities.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-input)', borderRadius: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>#{idx + 1} {item.cityName}</span>
                <span style={{ fontWeight: 700, color: 'var(--primary)' }}>{item.count.toLocaleString()} trips</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', background: '#FFFFFF' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Activity Interest Breakdown
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {stats.popularCategories.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.65rem 0.85rem', background: 'var(--bg-input)', borderRadius: '6px' }}>
                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{item.category}</span>
                <span style={{ fontWeight: 700, color: 'var(--accent-teal)' }}>{item.count.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      <style>{`
        @media (max-width: 800px) {
          .admin-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};
