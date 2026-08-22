import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { citiesService } from '../services/api/citiesService';
import type { City } from '../types';
import { CityCard } from '../components/discovery/CityCard';
import { Input } from '../components/common/Input';
import { useAuth } from '../context/AuthContext';
import { useTrips } from '../context/TripContext';
import { profileService } from '../services/api/profileService';

interface CitySearchPageProps {
  setActiveTab: (tab: string) => void;
}

export const CitySearchPage: React.FC<CitySearchPageProps> = ({ setActiveTab }) => {
  const { user, updateProfileState } = useAuth();
  const { trips, activeTrip, addStopToTrip } = useTrips();
  
  const [cities, setCities] = useState<City[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedCountry, setSelectedCountry] = useState('All');

  useEffect(() => {
    citiesService.getCities(searchQuery, selectedRegion, selectedCountry).then(setCities);
  }, [searchQuery, selectedRegion, selectedCountry]);

  const handleToggleSave = async (cityId: string) => {
    if (!user) return;
    const updated = await profileService.toggleSaveCity(cityId);
    updateProfileState(updated);
  };

  const handleAddToTrip = async (city: City) => {
    if (trips.length > 0 && activeTrip) {
      await addStopToTrip(activeTrip.id, city.id, activeTrip.startDate, activeTrip.endDate);
      setActiveTab('builder');
    } else {
      setActiveTab('create-trip');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>Discover Global Destinations</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Explore world cities, cost indexes, and popular travel destinations to include in your trip.
        </p>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', background: '#FFFFFF' }}>
        <div style={{ flex: 1, minWidth: '240px' }}>
          <Input
            placeholder="Search by city name, country, or tag (e.g. Tokyo, France, Food)..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            icon={<Search size={17} />}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Region:</span>
          <select
            className="input-field"
            value={selectedRegion}
            onChange={e => setSelectedRegion(e.target.value)}
            style={{ width: 'auto', padding: '0.45rem 0.8rem' }}
          >
            <option value="All">All Regions</option>
            <option value="Europe">Europe</option>
            <option value="Asia">Asia</option>
            <option value="North America">North America</option>
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Country:</span>
          <select
            className="input-field"
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            style={{ width: 'auto', padding: '0.45rem 0.8rem' }}
          >
            <option value="All">All Countries</option>
            <option value="Japan">Japan</option>
            <option value="France">France</option>
            <option value="Italy">Italy</option>
            <option value="Indonesia">Indonesia</option>
            <option value="Spain">Spain</option>
            <option value="United States">United States</option>
            <option value="Greece">Greece</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {cities.map(city => (
          <CityCard
            key={city.id}
            city={city}
            isSaved={user?.savedCityIds.includes(city.id)}
            onAddToTrip={handleAddToTrip}
            onToggleSave={handleToggleSave}
          />
        ))}
      </div>

    </div>
  );
};
