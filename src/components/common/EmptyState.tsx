import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, description, action }) => {
  return (
    <div style={{
      textAlign: 'center',
      padding: '3.5rem 2rem',
      background: 'var(--bg-card)',
      borderRadius: 'var(--radius-md)',
      border: '1px dashed var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.85rem',
      margin: '1.5rem 0'
    }}>
      <div style={{
        width: '58px',
        height: '58px',
        borderRadius: '50%',
        background: 'var(--primary-light)',
        color: 'var(--primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '0.2rem'
      }}>
        {icon}
      </div>
      <h3 style={{ fontSize: '1.2rem', fontFamily: 'Outfit, sans-serif', color: 'var(--text-primary)' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', maxWidth: '440px', fontSize: '0.9rem', lineHeight: 1.5 }}>{description}</p>
      {action && <div style={{ marginTop: '0.5rem' }}>{action}</div>}
    </div>
  );
};
