import React from 'react';
import { motion } from 'framer-motion';

export const BentoGrid = ({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div
      className={`propwise-bento-grid ${className || ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gridAutoRows: 'minmax(200px, auto)',
        gap: '16px',
        width: '100%'
      }}
    >
      {children}
    </div>
  );
};

export const BentoGridItem = ({
  className,
  title,
  description,
  header,
  icon,
  colSpan = 1,
  rowSpan = 1,
  onClick,
}: {
  className?: string;
  title?: string | React.ReactNode;
  description?: string | React.ReactNode;
  header?: React.ReactNode;
  icon?: React.ReactNode;
  colSpan?: number;
  rowSpan?: number;
  onClick?: () => void;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 0.98, y: -2 }}
      className={`propwise-card-new ${className || ''}`}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`,
        padding: '24px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
      onClick={onClick}
    >
      {header}
      <div style={{ marginTop: '16px' }}>
        {icon}
        <div style={{ fontFamily: '"Inter", sans-serif', fontWeight: 700, fontSize: '18px', color: 'var(--text-primary-new)', marginTop: '12px', marginBottom: '8px' }}>
          {title}
        </div>
        <div style={{ fontFamily: '"Inter", sans-serif', fontSize: '14px', color: 'var(--text-secondary-new)' }}>
          {description}
        </div>
      </div>
    </motion.div>
  );
};
