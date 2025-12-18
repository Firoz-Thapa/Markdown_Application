import React from 'react';
import './SaveIndicator.css';

const SaveIndicator = ({ status }) => {
  // status can be: 'idle', 'saving', 'saved', 'offline', 'error'
  
  const getIcon = () => {
    switch (status) {
      case 'saving':
        return <span className="save-spinner"></span>;
      case 'saved':
        return <span className="save-icon">✓</span>;
      case 'offline':
        return <span className="save-icon">📴</span>;
      case 'error':
        return <span className="save-icon">⚠️</span>;
      default:
        return null;
    }
  };

  const getText = () => {
    switch (status) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'offline':
        return 'Offline';
      case 'error':
        return 'Save failed';
      default:
        return '';
    }
  };

  if (status === 'idle') return null;

  return (
    <div className={`save-indicator ${status}`}>
      {getIcon()}
      <span className="save-text">{getText()}</span>
    </div>
  );
};

export default SaveIndicator;


