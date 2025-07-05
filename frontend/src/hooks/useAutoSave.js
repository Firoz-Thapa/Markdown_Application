import { useEffect, useRef } from 'react';

// Custom hook for auto-saving
export const useAutoSave = (markdown, delay = 2000) => {
  const timeoutRef = useRef(null);

  useEffect(() => {
    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('markdown-autosave', markdown);
        localStorage.setItem('markdown-autosave-timestamp', Date.now().toString());
        console.log('Auto-saved at', new Date().toLocaleTimeString());
      } catch (error) {
        console.error('Failed to auto-save:', error);
      }
    }, delay);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [markdown, delay]);
};

// Function to recover auto-saved content
export const recoverAutoSave = () => {
  try {
    const saved = localStorage.getItem('markdown-autosave');
    const timestamp = localStorage.getItem('markdown-autosave-timestamp');
    
    if (saved && timestamp) {
      const saveTime = new Date(parseInt(timestamp));
      const now = new Date();
      const hoursDiff = (now - saveTime) / (1000 * 60 * 60);
      
      // Only recover if saved within last 24 hours
      if (hoursDiff < 24) {
        return {
          content: saved,
          timestamp: saveTime
        };
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to recover auto-save:', error);
    return null;
  }
};

// Clear auto-save
export const clearAutoSave = () => {
  try {
    localStorage.removeItem('markdown-autosave');
    localStorage.removeItem('markdown-autosave-timestamp');
  } catch (error) {
    console.error('Failed to clear auto-save:', error);
  }
};