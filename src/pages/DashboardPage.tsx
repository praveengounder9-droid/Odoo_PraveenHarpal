import React, { useState, useEffect } from 'react';
import { PlusCircle, Compass, Calendar, MapPin, TrendingUp, ArrowRight, DollarSign, Sparkles, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { citiesService } from '../services/api/citiesService';
import type { City } from '../types';
import { TripCard } from '../components/trips/TripCard';
import { CityCard } from '../components/discovery/CityCard';
import { RealMapEngine } from '../components/map/RealMapEngine';
import { DestinationSearchModal } from '../components/map/DestinationSearchModal';
import type { GeocodedPlace } from '../services/api/geocodingService';

interface DashboardPageProps {
  setActiveTab: (tab: string) => void;
  onSelectTrip: (tripId: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ setActiveTab }) => {
  const { user } = useAuth();
  const { trips, activeTrip, deleteTrip, setActiveTripId, addStopToTrip } = useTrips();
  const [popularCities, setPopularCities] = useState<City[]>([]);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    citiesService.getCities('', 'All', 'All').then(cities => {
      setPopularCities(cities.slice(0, 3));
    });
  }, []);

  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const totalBudgetPlanned = trips.reduce((sum, t) => sum + t.estimatedBudget, 0);
  const totalStopsPlanned = trips.reduce((sum, t) => sum + t.stops.length, 0);
  const currencySymbol = user?.preferences?.currency === 'EUR' ? '€' : user?.preferences?.currency === 'GBP' ? '£' : user?.preferences?.currency === 'JPY' ? '¥' : '$';

  const handleQuickAddCity = async (city: City) => {
    if (trips.length > 0 && activeTrip) {
      await addStopToTrip(activeTrip.id, city.id, activeTrip.startDate, activeTrip.endDate);
      setActiveTab('builder');
    } else {
      setActiveTab('create-trip');
    }
  };

  const handleGeocodedPlaceSelect = async (place: GeocodedPlace) => {
    if (trips.length > 0 && activeTrip) {
      await addStopToTrip(activeTrip.id, place.cityName, activeTrip.startDate, activeTrip.endDate, {
        lat: place.lat,
        lng: place.lng,
        country: place.country,
        displayName: place.displayName,
        category: place.category,
        cityName: place.cityName
      });
      setActiveTab('builder');
    } else {
      setActiveTab('create-trip');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2.25rem' }}>
      
      {/* Real-time Destination Search Modal */}
      <DestinationSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        onSelectPlace={handleGeocodedPlaceSelect}
      />

      {/* Hero Welcome Header */}
      <div className="glass-panel" style={{
        padding: '2rem 2.25rem',
        background: 'linear-gradient(135deg, var(--bg-subtle), var(--bg-card))',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.3rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem', border: '1px solid rgba(184, 111, 82, 0.2)' }}>
            <Compass size={14} /> Personal Travel Journal
          </div>
          <h2 style={{ fontSize: '2.2rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', marginBottom: '0.4rem', lineHeight: 1.2 }}>
            Where is your next adventure taking you, {user?.name.split(' ')[0]}?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '650px' }}>
            Organize multi-city itineraries, discover curated world destinations, track travel budgets, and explore spatial routes.
          </p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem' }}>
          <button
            onClick={() => setShowSearchModal(true)}
            className="btn btn-primary btn-lg"
          >
            <Search size={18} />
            <span>+ Add Destination</span>
          </button>
          <button
            onClick={() => setActiveTab('create-trip')}
            className="btn btn-secondary btn-lg"
          >
            <PlusCircle size={18} />
            <span>Plan New Trip</span>
          </button>
        </div>
      </div>

      {/* Real MapLibre Vector Map Engine Hero Workspace */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <div>
            <h3 style={{ fontSize: '1.35rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} style={{ color: 'var(--primary)' }} />
              Interactive Travel Map Engine (MapLibre GL JS)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Real vector tiles, 3D camera controls & per-user dynamic route lines</p>
          </div>
        </div>

        <RealMapEngine
          stops={activeTrip?.stops || []}
          onOpenSearchModal={() => setShowSearchModal(true)}
          height="450px"
        />
      </div>

      {/* Quick Metrics Bar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Calendar size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Total Journeys</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{trips.length}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(74, 124, 116, 0.1)', color: 'var(--accent-teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MapPin size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Cities Configured</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{totalStopsPlanned}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(196, 154, 90, 0.12)', color: 'var(--accent-champagne)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <DollarSign size={22} />
          </div>
          <div>
            <div style={{ fontSize: '0.785rem', color: 'var(--text-muted)' }}>Planned Budget <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>[User Value]</span></div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{currencySymbol}{totalBudgetPlanned.toLocaleString()}</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.2rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'var(--bg-card)' }}>
          <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: 'rgba(114, 119, 95, 0.12)', color: 'var(--accent-olive)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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

        {trips.length === 0 ? (
          <div className="glass-card" style={{ padding: '2.5rem 2rem', textAlign: 'center', background: 'var(--bg-card)', borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--border-color)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.85rem' }}>
            <div style={{ width: '54px', height: '54px', borderRadius: '50%', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Compass size={28} />
            </div>
            <h3 style={{ fontSize: '1.3rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)', margin: 0 }}>
              Your next adventure starts here.
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '450px', margin: 0 }}>
              You don't have any saved trips yet. Start planning your personalized travel itinerary!
            </p>
            <button onClick={() => setActiveTab('create-trip')} className="btn btn-primary btn-md" style={{ marginTop: '0.5rem' }}>
              <PlusCircle size={16} />
              <span>+ Plan Your First Trip</span>
            </button>
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
