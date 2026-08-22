import React from 'react';
import { MapPin, Calendar, Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import type { TripStop } from '../../types';
import { ActivityItem } from './ActivityItem';

interface StopCardProps {
  stop: TripStop;
  index: number;
  totalStops: number;
  onRemoveStop: (stopId: string) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  onAddActivity: (stopId: string) => void;
  onRemoveActivity: (stopId: string, activityId: string) => void;
}

export const StopCard: React.FC<StopCardProps> = ({
  stop,
  index,
  totalStops,
  onRemoveStop,
  onMoveUp,
  onMoveDown,
  onAddActivity,
  onRemoveActivity,
}) => {
  return (
    <div className="glass-card" style={{ marginBottom: '1.5rem', overflow: 'hidden', background: '#FFFFFF' }}>
      {/* Stop Header */}
      <div style={{
        padding: '1.2rem 1.5rem',
        background: 'var(--bg-subtle)',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--radius-sm)',
            overflow: 'hidden',
            flexShrink: 0,
            border: '1px solid var(--border-color)'
          }}>
            <img src={stop.coverImage} alt={stop.cityName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{
                background: 'var(--primary)',
                color: '#FFFFFF',
                fontSize: '0.725rem',
                fontWeight: 700,
                padding: '0.1rem 0.5rem',
                borderRadius: '4px'
              }}>
                Stop #{index + 1}
              </span>
              <h3 style={{ fontSize: '1.2rem', fontFamily: 'Playfair Display, Georgia, serif', color: 'var(--text-primary)' }}>
                {stop.cityName}, {stop.country}
              </h3>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <Calendar size={13} /> {stop.startDate} → {stop.endDate}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <MapPin size={13} /> Est. Stay: ${stop.stayCost}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          {index > 0 && onMoveUp && (
            <button onClick={onMoveUp} className="btn btn-secondary btn-sm" title="Move stop up">
              <ArrowUp size={14} />
            </button>
          )}
          {index < totalStops - 1 && onMoveDown && (
            <button onClick={onMoveDown} className="btn btn-secondary btn-sm" title="Move stop down">
              <ArrowDown size={14} />
            </button>
          )}
          <button onClick={() => onRemoveStop(stop.id)} className="btn btn-danger btn-sm" title="Remove stop">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Activities Body */}
      <div style={{ padding: '1.25rem 1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Activities ({stop.activities.length})
          </h4>
          <button
            onClick={() => onAddActivity(stop.id)}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={14} />
            <span>Add Activity</span>
          </button>
        </div>

        {stop.activities.length === 0 ? (
          <div style={{
            padding: '1.5rem',
            textAlign: 'center',
            background: 'var(--bg-input)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border-color)',
            color: 'var(--text-muted)',
            fontSize: '0.875rem'
          }}>
            No activities scheduled for this stop yet. Click "+ Add Activity" to enrich your itinerary.
          </div>
        ) : (
          <div>
            {stop.activities.map(act => (
              <ActivityItem
                key={act.id}
                activity={act}
                onRemove={() => onRemoveActivity(stop.id, act.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
