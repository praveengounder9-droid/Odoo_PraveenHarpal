import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'primary', icon }) => {
  return (
    <span className={`badge badge-${variant}`}>
      {icon && <span>{icon}</span>}
      {children}
    </span>
  );
};
