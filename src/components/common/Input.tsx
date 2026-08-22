import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="form-group">
      {label && <label htmlFor={inputId} className="form-label">{label}</label>}
      <div style={{ position: 'relative', width: '100%' }}>
        {icon && (
          <div style={{
            position: 'absolute',
            left: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--text-muted)',
            display: 'flex',
            alignItems: 'center',
            pointerEvents: 'none'
          }}>
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`input-field ${className}`}
          style={{ paddingLeft: icon ? '2.5rem' : '1rem' }}
          {...props}
        />
      </div>
      {error && <span style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginTop: '0.2rem' }}>{error}</span>}
    </div>
  );
};
