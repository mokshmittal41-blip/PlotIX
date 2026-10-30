import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'verified' | 'unverified' | 'type' | 'status-planned' | 'status-construction' | 'status-completed' | 'impact-high' | 'impact-medium' | 'impact-low';
  className?: string;
}

export default function Badge({ children, variant = 'type', className = '' }: BadgeProps) {
  return (
    <span className={`badge badge-${variant} ${className}`}>
      {children}
    </span>
  );
}
