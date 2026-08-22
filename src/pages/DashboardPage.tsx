import React, { useState, useEffect } from 'react';
import { PlusCircle, Compass, Calendar, DollarSign, MapPin, TrendingUp, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { citiesService } from '../services/api/citiesService';
import type { City } from '../types';
import { TripCard } from '../components/trips/TripCard';
import { CityCard } from '../components/discovery/CityCard';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  onSelectTrip: (tripId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { trips, deleteTrip, setActiveTripId, addStopToTrip } = useTrips();
  const [popularCities, setPopularCities] = useState<City[]>([]);

  useEffect(() => {
    citiesService.getCities('', 'All', 'All').then(cities => {
      setPopularCities(cities.slice(0, 3));
    });
  }, []);

  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const totalBudgetPlanned = trips.reduce((sum, t) => sum + t.estimatedBudget, 0);
  const totalStopsPlanned = trips.reduce((sum, t) => sum + t.stops.length, 0);

  const handleQuickAddCity = async (city: City) => {
    if (trips.length > 0) {
      const active = trips[0];
      await addStopToTrip(active.id, city.id, active.startDate, active.endDate);
      setActiveTab('builder');
    } else {
      setActiveTab('create-trip');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
      
      {/* Hero Travel Workspace Welcome Banner */}
      <div className="glass-panel" style={{
        padding: '2.5rem',
        background: 'linear-gradient(135deg, var(--bg-subtle), var(--bg-card))',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
      }}>
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '750px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1rem', border: '1px solid rgba(184, 91, 61, 0.2)' }}>
            <Compass size={14} /> Personal Travel Journal
          </div>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', marginBottom: '0.5rem', lineHeight: 1.2 }}>
            Where is your next adventure taking you, {user?.name.split(' ')[0]}?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            Organize multi-city itineraries, discover curated world destinations, track your travel budget, and share your personal travel timeline.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
            <button
              onClick={() => setActiveTab('create-trip')}
              className="btn btn-primary btn-lg"
            >
              <PlusCircle size={18} />
              <span>Plan New Trip</span>
            </button>
            <button
              onClick={() => setActiveTab('cities')}
              className="btn btn-secondary btn-lg"
            >
              <Compass size={18} />
              <span>Explore Destinations</span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Total Journeys</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{trips.length}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(74, 124, 116, 0.1)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Cities Configured</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalStopsPlanned}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(212, 155, 75, 0.12)', color: 'var(--accent-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Planned Budget</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>${totalBudgetPlanned.toLocaleString()}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(107, 112, 92, 0.12)', color: 'var(--accent-olive)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Travel Status</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>Active</div>
          </div>
        </div>
      </div>

      {/* Upcoming Trips Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>Upcoming Trips</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Your next scheduled travel itineraries</p>
          </div>
          <button onClick={() => setActiveTab('my-trips')} className="btn btn-secondary btn-sm">
            <span>View All Trips</span>
            <ArrowRight size={15} />
          </button>
        </div>

        {upcomingTrips.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)', color: 'var(--text-muted)' }}>
            No upcoming trips scheduled. Create a new trip to start planning your itinerary!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {upcomingTrips.map(trip => (
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

      {/* Recommended Destinations Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>Recommended Destinations</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Trending world cities curated for your profile</p>
          </div>
          <button onClick={() => setActiveTab('cities')} className="btn btn-secondary btn-sm">
            <span>Explore All</span>
            <ArrowRight size={15} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {popularCities.map(city => (
            <CityCard
              key={city.id}
              city={city}
              isSaved={user?.savedCityIds.includes(city.id)}
              onAddToTrip={handleQuickAddCity}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
