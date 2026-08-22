import React from 'react';

interface CategoryDonutChartProps {
  categories: {
    transport: number;
    accommodation: number;
    activities: number;
    meals: number;
    other: number;
  };
  totalActualCost: number;
}

export const CategoryDonutChart: React.FC<CategoryDonutChartProps> = ({ categories, totalActualCost }) => {
  const items = [
    { label: 'Accommodation', amount: categories.accommodation, color: '#B85B3D' }, // Terracotta
    { label: 'Transport', amount: categories.transport, color: '#4A7C74' },     // Sage Teal
    { label: 'Activities', amount: categories.activities, color: '#6B705C' },    // Olive
    { label: 'Meals', amount: categories.meals, color: '#D49B4B' },         // Ochre Gold
    { label: 'Other/Misc', amount: categories.other, color: '#8C847C' },        // Warm Taupe
  ].filter(i => i.amount > 0);

  const safeTotal = totalActualCost || 1;
  let accumulatedAngle = 0;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
      <div style={{ position: 'relative', width: '190px', height: '190px' }}>
        <svg viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
          {items.map((item, idx) => {
            const percentage = item.amount / safeTotal;
            const strokeDasharray = `${percentage * 282.7} 282.7`;
            const strokeDashoffset = -accumulatedAngle * 282.7;
            accumulatedAngle += percentage;

            return (
              <circle
                key={idx}
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
                stroke={item.color}
                strokeWidth="10"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                style={{ transition: 'all 0.5s ease' }}
              />
            );
          })}
        </svg>

        {/* Center Label */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Cost</span>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            ${totalActualCost}
          </span>
        </div>
      </div>

      {/* Legend Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', width: '100%' }}>
        {items.map((item, idx) => {
          const pct = Math.round((item.amount / safeTotal) * 100);
          return (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.825rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ width: '9px', height: '9px', borderRadius: '50%', background: item.color }} />
                <span style={{ color: 'var(--text-secondary)' }}>{item.label}</span>
              </div>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>${item.amount} ({pct}%)</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
