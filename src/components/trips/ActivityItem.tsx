import React from 'react';
import { Clock, DollarSign, Trash2, CheckCircle2 } from 'lucide-react';
import type { TripActivity } from '../../types';
import { Badge } from '../common/Badge';

interface ActivityItemProps {
  activity: TripActivity;
  onRemove?: () => void;
}

export const ActivityItem: React.FC<ActivityItemProps> = ({ activity, onRemove }) => {
  const categoryVariant = 
    activity.category === 'Food' ? 'warning' :
    activity.category === 'Adventure' ? 'danger' :
    activity.category === 'Culture' ? 'primary' : 'success';

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0.75rem 1rem',
      background: 'var(--bg-input)',
      borderRadius: 'var(--radius-sm)',
      border: '1px solid var(--border-color)',
      marginBottom: '0.5rem'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: '30px',
          height: '30px',
          borderRadius: '50%',
          background: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 'bold',
          fontSize: '0.8rem'
        }}>
          <CheckCircle2 size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            {activity.name}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <Clock size={13} /> {activity.startTime || 'Flexible'} ({activity.durationHours}h)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.1rem' }}>
              <DollarSign size={13} /> ${activity.cost}
            </span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Badge variant={categoryVariant}>{activity.category}</Badge>
        {onRemove && (
          <button onClick={onRemove} style={{ color: 'var(--text-muted)', padding: '0.2rem' }} title="Remove activity">
            <Trash2 size={15} />
          </button>
        )}
      </div>
    </div>
  );
};
