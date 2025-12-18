import { useEffect, useRef, useState, useCallback } from 'react';
export const useAutoSave = (markdown, delay = 1500) => {
  const [saveStatus, setSaveStatus] = useState('idle'); 
  const timeoutRef = useRef(null);
  const savedTimeoutRef = useRef(null);
  const lastSavedContent = useRef(markdown);

  useEffect(() => {
    // Don't save if content hasn't changed
    if (markdown === lastSavedContent.current) {
      return;
    }

    // Clear existing timeouts
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    if (savedTimeoutRef.current) {
      clearTimeout(savedTimeoutRef.current);
    }

    setSaveStatus('saving');

    timeoutRef.current = setTimeout(() => {
      try {
        if (!navigator.onLine) {
          setSaveStatus('offline');
          return;
        }

        localStorage.setItem('markdown-autosave', markdown);
        localStorage.setItem('markdown-autosave-timestamp', Date.now().toString());
        lastSavedContent.current = markdown;
        
        setSaveStatus('saved');
        
        savedTimeoutRef.current = setTimeout(() => {
          setSaveStatus('idle');
        }, 2000);
        
      } catch (error) {
        console.error('Failed to auto-save:', error);
        setSaveStatus('error');
        
        savedTimeoutRef.current = setTimeout(() => {
          setSaveStatus('idle');
        }, 3000);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [markdown, delay]);

  useEffect(() => {
    const handleOnline = () => {
      if (saveStatus === 'offline') {
        setSaveStatus('idle');
      }
    };

    const handleOffline = () => {
      setSaveStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [saveStatus]);

  useEffect(() => {
    return () => {
      if (savedTimeoutRef.current) {
        clearTimeout(savedTimeoutRef.current);
      }
    };
  }, []);

  return saveStatus;
};

export const recoverAutoSave = () => {
  try {
    const saved = localStorage.getItem('markdown-autosave');
    const timestamp = localStorage.getItem('markdown-autosave-timestamp');
    
    if (saved && timestamp) {
      const saveTime = new Date(parseInt(timestamp));
      const now = new Date();
      const hoursDiff = (now - saveTime) / (1000 * 60 * 60);
      
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

export const clearAutoSave = () => {
  try {
    localStorage.removeItem('markdown-autosave');
    localStorage.removeItem('markdown-autosave-timestamp');
  } catch (error) {
    console.error('Failed to clear auto-save:', error);
  }
};