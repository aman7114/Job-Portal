import React from 'react';

const Card = ({ children, className = '', style = {}, hover = false }) => {
  return (
    <div className={`glass ${hover ? 'card-hover' : ''} ${className}`} style={{ padding: '24px', ...style }}>
      {children}
    </div>
  );
};

export default Card;
