import React from 'react';

export const Loader = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', width: '100%' }}>
        <div className="loader-spinner"></div>
      </div>
    );
  }
  return <div className="loader-spinner"></div>;
};

export const Skeleton = ({ height = '120px', width = '100%', className = '', style = {} }) => {
  return (
    <div 
      className={`skeleton-loader ${className}`} 
      style={{ height, width, borderRadius: 'var(--border-radius-md)', ...style }}
    ></div>
  );
};
