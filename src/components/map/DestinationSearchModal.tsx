import React, { useState } from 'react';
import { Search, MapPin, Plus, Loader2, Compass } from 'lucide-react';
import { geocodingService } from '../../services/api/geocodingService';
import type { GeocodedPlace } from '../../services/api/geocodingService';
import { Modal } from '../common/Modal';

interface DestinationSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlace: (place: GeocodedPlace) => void;
}

export const DestinationSearchModal: React.FC<DestinationSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectPlace,
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<GeocodedPlace[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    try {
      const data = await geocodingService.searchPlaces(query);
      setResults(data);
    } catch (err) {
      console.error('Search failed', err);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAdd = (place: GeocodedPlace) => {
    onSelectPlace(place);
    onClose();
    setQuery('');
    setResults([]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search World Destination or Place">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search city, landmark, hotel or place (e.g. Paris, Taj Mahal, Tokyo)..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              style={{ paddingLeft: '2.5rem' }}
              autoFocus
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={isSearching}>
            {isSearching ? <Loader2 size={16} className="animate-spin" /> : 'Search'}
          </button>
        </form>

        {results.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '350px', overflowY: 'auto' }}>
            {results.map(place => (
              <div
                key={place.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  background: 'var(--bg-input)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--primary-light)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <MapPin size={18} />
                  </div>
                  <div style={{ overflow: 'hidden' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                      {place.cityName} <span style={{ fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 600 }}>[{place.category}]</span>
                    </div>
                    <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                      {place.displayName}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--accent-teal)', marginTop: '0.1rem' }}>
                      Lat: {place.lat.toFixed(4)}, Lng: {place.lng.toFixed(4)} [Live Geocoded]
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdd(place)}
                  className="btn btn-primary btn-sm"
                  style={{ flexShrink: 0 }}
                >
                  <Plus size={14} />
                  <span>Add to Trip</span>
                </button>
              </div>
            ))}
          </div>
        )}

        {results.length === 0 && !isSearching && query.length > 2 && (
          <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            No geographic results found for "{query}". Try searching a major city or landmark.
          </div>
        )}

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem' }}>
          <Compass size={14} style={{ color: 'var(--primary)' }} />
          <span>Real-time global geocoding provided by OpenStreetMap & CARTO</span>
        </div>

      </div>
    </Modal>
  );
};
