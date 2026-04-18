import React from 'react';

const Badge = ({ variant = 'primary', children, className = '' }) => {
  // variant maps: 'applied'->blue, 'accepted'->green, 'rejected'->red, 'reviewed'->yellow
  const lowerVariant = variant.toLowerCase();
  
  return (
    <span className={`badge-status ${lowerVariant} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
