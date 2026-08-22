import React from 'react';
import { Clock, Star, Plus, MapPin } from 'lucide-react';
import type { Activity } from '../../types';
import { Badge } from '../common/Badge';

interface ActivityCardProps {
  activity: Activity;
  onAdd: (activity: Activity) => void;
}

export const ActivityCard: React.FC<ActivityCardProps> = ({ activity, onAdd }) => {
  const categoryVariant = 
    activity.category === 'Food' ? 'warning' :
    activity.category === 'Adventure' ? 'danger' :
    activity.category === 'Culture' ? 'primary' : 'success';

  return (
    <div className="glass-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#FFFFFF' }}>
      <div style={{ position: 'relative', height: '165px' }}>
        <img src={activity.coverImage} alt={activity.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top, rgba(31, 26, 23, 0.85), transparent 50%)'
        }} />
        <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
          <Badge variant={categoryVariant}>{activity.category}</Badge>
        </div>
        <div style={{ position: 'absolute', bottom: '10px', left: '12px', right: '12px' }}>
          <span style={{ fontSize: '0.75rem', color: '#F3EFE6', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <MapPin size={12} /> {activity.cityName}
          </span>
          <h4 style={{ fontSize: '1.05rem', fontFamily: 'Playfair Display, Georgia, serif', color: '#FFFFFF', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activity.name}
          </h4>
        </div>
      </div>

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.6rem', flex: 1 }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.825rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.45 }}>
          {activity.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
            <Clock size={14} /> {activity.durationHours}h duration
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--accent-gold)', fontWeight: 600 }}>
            <Star size={14} fill="var(--accent-gold)" /> {activity.rating}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 'auto', paddingTop: '0.6rem', borderTop: '1px solid var(--border-color)' }}>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>
            ${activity.cost}
          </span>
          <button
            onClick={() => onAdd(activity)}
            className="btn btn-secondary btn-sm"
          >
            <Plus size={14} />
            <span>Add to Itinerary</span>
          </button>
        </div>
      </div>
    </div>
  );
};
