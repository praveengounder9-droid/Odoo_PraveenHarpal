import React, { useState } from 'react';
import { PlusCircle, Search, Map } from 'lucide-react';
import { useTrips } from '../context/TripContext';
import { TripCard } from '../components/trips/TripCard';
import { EmptyState } from '../components/common/EmptyState';
import { Input } from '../components/common/Input';

interface MyTripsPageProps {
  setActiveTab: (tab: string) => void;
}

export const MyTripsPage: React.FC<MyTripsPageProps> = ({ setActiveTab }) => {
  const { trips, deleteTrip, setActiveTripId } = useTrips();
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredTrips = trips.filter(trip => {
    const matchesStatus = filterStatus === 'all' || trip.status === filterStatus;
    const matchesQuery = trip.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         trip.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>My Trips ({trips.length})</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Manage your personal travel itineraries and multi-city stops
          </p>
        </div>
        <button
          onClick={() => setActiveTab('create-trip')}
          className="btn btn-primary"
        >
          <PlusCircle size={17} />
          <span>Plan New Trip</span>
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'var(--bg-input)', padding: '0.3rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
          {['all', 'upcoming', 'completed', 'planning'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                padding: '0.4rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'capitalize',
                color: filterStatus === st ? 'var(--primary)' : 'var(--text-muted)',
                background: filterStatus === st ? 'var(--bg-card)' : 'transparent',
                boxShadow: filterStatus === st ? '0 2px 6px rgba(0,0,0,0.04)' : 'none'
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ width: '280px' }}>
          <Input
            placeholder="Search trips..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search size={16} />}
            style={{ padding: '0.5rem 1rem 0.5rem 2.5rem' }}
          />
        </div>
      </div>

      {filteredTrips.length === 0 ? (
        <EmptyState
          icon={<Map size={30} />}
          title="No trips found"
          description={searchQuery || filterStatus !== 'all' 
            ? "No trips matched your search or status filter criteria."
            : "You haven't planned any trips yet. Create your first travel itinerary!"}
          action={
            <button onClick={() => setActiveTab('create-trip')} className="btn btn-primary">
              <PlusCircle size={17} />
              <span>Create Your First Trip</span>
            </button>
          }
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredTrips.map(trip => (
            <TripCard
              key={trip.id}
              trip={trip}
              onView={id => { setActiveTripId(id); setActiveTab('itinerary-view'); }}
              onEdit={t => { setActiveTripId(t.id); setActiveTab('builder'); }}
              onDelete={id => deleteTrip(id)}
              onShare={t => { setActiveTripId(t.id); setActiveTab('shared'); }}
            />
          ))}
        </div>
      )}

    </div>
  );
};
