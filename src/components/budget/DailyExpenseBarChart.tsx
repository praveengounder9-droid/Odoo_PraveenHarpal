import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface DailyExpenseBarChartProps {
  dailyExpenses: {
    date: string;
    dayLabel: string;
    cityName: string;
    amount: number;
    budgetLimit: number;
    isOverBudget: boolean;
  }[];
}

export const DailyExpenseBarChart: React.FC<DailyExpenseBarChartProps> = ({ dailyExpenses }) => {
  if (dailyExpenses.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No daily expense data available yet.
      </div>
    );
  }

  const maxAmount = Math.max(...dailyExpenses.map(d => Math.max(d.amount, d.budgetLimit)), 300);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1rem', height: '220px', padding: '1rem 0', borderBottom: '1px solid var(--border-color)' }}>
        {dailyExpenses.map((day, idx) => {
          const heightPct = Math.round((day.amount / maxAmount) * 100);
          const limitPct = Math.round((day.budgetLimit / maxAmount) * 100);

          return (
            <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', position: 'relative' }}>
              
              {/* Daily Limit Guideline */}
              <div style={{
                position: 'absolute',
                bottom: `${limitPct}%`,
                left: 0,
                right: 0,
                borderTop: '1px dashed #C2BBB0',
                pointerEvents: 'none'
              }} />

              {/* Amount Label */}
              <span style={{
                fontSize: '0.725rem',
                fontWeight: 700,
                color: day.isOverBudget ? 'var(--accent-rose)' : 'var(--text-primary)',
                marginBottom: '0.3rem'
              }}>
                ${day.amount}
              </span>

              {/* Expense Bar */}
              <div style={{
                width: '65%',
                maxWidth: '32px',
                height: `${heightPct}%`,
                background: day.isOverBudget
                  ? 'linear-gradient(to top, #C94C4C, #E06D6D)'
                  : 'linear-gradient(to top, #B85B3D, #D47353)',
                borderRadius: '5px 5px 0 0',
                transition: 'all 0.4s ease',
                position: 'relative'
              }}>
                {day.isOverBudget && (
                  <div style={{
                    position: 'absolute',
                    top: '-18px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    color: 'var(--accent-rose)'
                  }}>
                    <AlertTriangle size={14} />
                  </div>
                )}
              </div>

              {/* Day Label */}
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem', whiteSpace: 'nowrap' }}>
                {day.dayLabel}
              </span>
            </div>
          );
        })}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#B85B3D' }} />
          <span>Within Budget</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#C94C4C' }} />
          <span>Exceeds Daily Limit</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ width: '16px', height: '0px', borderTop: '1px dashed #C2BBB0' }} />
          <span>Target Daily Limit</span>
        </div>
      </div>
    </div>
  );
};
