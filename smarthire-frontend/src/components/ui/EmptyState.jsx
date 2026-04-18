import React from 'react';

const EmptyState = ({ icon: Icon, title, message, action, onRetry, isError = false }) => {
  return (
    <div className={`glass empty-state ${isError ? 'error-border' : ''}`} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', textAlign: 'center', borderColor: isError ? 'rgba(239, 68, 68, 0.4)' : undefined }}>
      {Icon && <div style={{ fontSize: '3rem', color: isError ? 'var(--danger)' : 'rgba(255,255,255,0.4)', marginBottom: '16px' }}><Icon /></div>}
      <h3 style={{ fontSize: '1.5rem', marginBottom: '8px', color: isError ? 'var(--danger)' : 'var(--text-light)' }}>{title}</h3>
      <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '400px', marginBottom: (action || onRetry) ? '24px' : '0' }}>{message}</p>
      
      <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
        {action && <div>{action}</div>}
        {onRetry && (
          <button onClick={onRetry} className="btn btn-outline" style={{ borderColor: isError ? 'var(--danger)' : undefined, color: isError ? 'var(--danger)' : undefined }}>
            Try Again
          </button>
        )}
      </div>
    </div>
  );
};

export default EmptyState;

