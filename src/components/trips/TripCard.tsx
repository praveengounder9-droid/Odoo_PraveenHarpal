import React from 'react';
import { Calendar, MapPin, DollarSign, Eye, Edit3, Trash2, Share2 } from 'lucide-react';
import type { Trip } from '../../types';
import { Badge } from '../common/Badge';

interface TripCardProps {
  trip: Trip;
  onView: (tripId: string) => void;
  onEdit: (trip: Trip) => void;
  onDelete: (tripId: string) => void;
  onShare: (trip: Trip) => void;
}

export const TripCard: React.FC<TripCardProps> = ({ trip, onView, onEdit, onDelete, onShare }) => {
  const statusVariant = trip.status === 'upcoming' ? 'primary' : trip.status === 'completed' ? 'success' : 'warning';
  
  return (
    <div className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
      {/* Cover Image & Status Header */}
      <div style={{ position: 'relative', height: '180px' }}>
        <img
          src={trip.coverImage || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'}
          alt={trip.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(31, 26, 23, 0.85), transparent 60%)'
        }} />
        <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
          <Badge variant={statusVariant}>{trip.status}</Badge>
        </div>
        <div style={{ position: 'absolute', bottom: '12px', left: '16px', right: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontFamily: 'Playfair Display, Georgia, serif', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {trip.name}
          </h3>
        </div>
      </div>

      {/* Card Content Body */}
      <div style={{ padding: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
          {trip.description || 'No trip description provided.'}
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: 'auto', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Calendar size={14} style={{ color: 'var(--primary)' }} />
            <span>{trip.startDate}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={14} style={{ color: 'var(--accent-teal)' }} />
            <span>{trip.stops.length} Cities</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <DollarSign size={14} style={{ color: 'var(--accent-gold)' }} />
            <span>${trip.estimatedBudget} Budget</span>
          </div>
        </div>

        {/* Actions Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: '0.85rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid var(--border-color)'
        }}>
          <button
            onClick={() => onView(trip.id)}
            className="btn btn-primary btn-sm"
          >
            <Eye size={14} />
            <span>View Plan</span>
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <button
              onClick={() => onShare(trip)}
              title="Share Itinerary"
              style={{ color: 'var(--text-secondary)', padding: '0.35rem' }}
            >
              <Share2 size={15} />
            </button>
            <button
              onClick={() => onEdit(trip)}
              title="Edit Trip"
              style={{ color: 'var(--text-secondary)', padding: '0.35rem' }}
            >
              <Edit3 size={15} />
            </button>
            <button
              onClick={() => onDelete(trip.id)}
              title="Delete Trip"
              style={{ color: 'var(--accent-rose)', padding: '0.35rem' }}
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
