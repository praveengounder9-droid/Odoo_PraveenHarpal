import React from 'react';
import { MapPin, DollarSign, Plus, Bookmark } from 'lucide-react';
import type { City } from '../../types';
import { Badge } from '../common/Badge';

interface CityCardProps {
  city: City;
  isSaved?: boolean;
  onAddToTrip: (city: City) => void;
  onToggleSave?: (cityId: string) => void;
}

export const CityCard: React.FC<CityCardProps> = ({ city, isSaved = false, onAddToTrip, onToggleSave }) => {
  return (
    <div className="glass-card card-25d" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', background: 'var(--bg-card)' }}>
      <div className="card-25d-inner" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ position: 'relative', height: '185px', overflow: 'hidden' }}>
          <img src={city.coverImage} alt={city.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to top, rgba(31, 26, 23, 0.85), transparent 60%)'
          }} />
          {onToggleSave && (
            <button
              onClick={() => onToggleSave(city.id)}
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'var(--glass-bg)',
                backdropFilter: 'blur(8px)',
                padding: '0.4rem',
                borderRadius: '50%',
                color: isSaved ? 'var(--accent-champagne)' : 'var(--text-secondary)',
                border: '1px solid var(--border-color)',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
            >
              <Bookmark size={15} fill={isSaved ? 'var(--accent-champagne)' : 'none'} />
            </button>
          )}
          <div style={{ position: 'absolute', bottom: '12px', left: '16px' }}>
            <Badge variant="primary">{city.costIndex} Cost Level</Badge>
            <h3 style={{ fontSize: '1.35rem', fontFamily: 'Playfair Display, Georgia, serif', color: '#FFFFFF', marginTop: '0.2rem' }}>
              {city.name}
            </h3>
            <span style={{ fontSize: '0.8rem', color: '#E6E1D7', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
              <MapPin size={12} /> {city.country} • {city.region}
            </span>
          </div>
        </div>

        <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
            {city.description}
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {city.tags.map(tag => (
              <span key={tag} style={{
                background: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                fontSize: '0.725rem',
                padding: '0.15rem 0.5rem',
                borderRadius: '4px',
                fontWeight: 500
              }}>
                #{tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)' }}>
            <div>
              <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>Avg Daily Cost <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: 700 }}>[Estimated]</span></div>
              <div style={{ fontWeight: 700, color: 'var(--accent-teal)', fontSize: '0.95rem', display: 'flex', alignItems: 'center' }}>
                <DollarSign size={14} /> ${city.averageDailyCost}/day
              </div>
            </div>
            <button
              onClick={() => onAddToTrip(city)}
              className="btn btn-primary btn-sm"
            >
              <Plus size={14} />
              <span>Add to Trip</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
