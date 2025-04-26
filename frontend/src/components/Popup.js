import React, { useState, useEffect, useCallback } from 'react';
import './Popup.css';

const Popup = ({ isVisible, type, onClose, onConfirm }) => {
  const [inputValue, setInputValue] = useState('');
  const [altText, setAltText] = useState('');

  const handleConfirm = useCallback(() => {
    if (type === 'link') {
      onConfirm({ type, url: inputValue, text: inputValue });
    } else if (type === 'image') {
      onConfirm({ type, url: inputValue, altText });
    }
    onClose();
  }, [type, inputValue, altText, onConfirm, onClose]);

  useEffect(() => {
    if (isVisible) {
      const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
          handleConfirm();
        }
      };
      window.addEventListener('keydown', handleKeyPress);
      return () => {
        window.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isVisible, handleConfirm]);

  useEffect(() => {
    // Reset input fields when the popup becomes visible
    if (isVisible) {
      setInputValue('');
      setAltText('');
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <button className="popup-close" onClick={onClose}>×</button>
        {type === 'link' && (
          <>
            <label>Enter URL:</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <label>Enter Alt Text:</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </>
        )}
        {type === 'image' && (
          <>
            <label>Enter Image URL:</label>
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <label>Enter Alt Text:</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
            />
          </>
        )}
        <div className="popup-actions">
          <button className="popup-confirm" onClick={handleConfirm}>Confirm</button>
          <button className="popup-cancel" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
