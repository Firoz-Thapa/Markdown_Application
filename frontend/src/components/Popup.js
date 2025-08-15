import React, { useState, useEffect, useCallback } from 'react';
import './Popup.css';

const Popup = ({ isVisible, type, onClose, onConfirm }) => {
  const [url, setUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [altText, setAltText] = useState('');

  const handleConfirm = useCallback(() => {
    if (type === 'link') {
      onConfirm({ 
        type, 
        url: url, 
        text: linkText || 'Link Text' // Use linkText, not url
      });
    } else if (type === 'image') {
      onConfirm({ 
        type, 
        url: url, 
        altText: altText || 'Alt Text'
      });
    }
    onClose();
  }, [type, url, linkText, altText, onConfirm, onClose]);

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
      setUrl('');
      setLinkText('');
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
            <h3>Insert Link</h3>
            <label>Link Text (what users will see):</label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Enter link text (e.g., GITHUB)"
              autoFocus
            />
            <label>URL (where the link goes):</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter URL (e.g., https://github.com/...)"
            />
          </>
        )}
        {type === 'image' && (
          <>
            <h3>Insert Image</h3>
            <label>Image URL:</label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter image URL"
              autoFocus
            />
            <label>Alt Text (description for accessibility):</label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Enter alt text"
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