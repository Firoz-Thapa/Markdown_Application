import React, { useEffect, useRef, useCallback } from 'react';

const SyncedPreview = ({ markdown, converter, editorRef }) => {
  const previewRef = useRef(null);
  const isScrollingRef = useRef(false);
  const syncTimeoutRef = useRef(null);

  const html = converter.makeHtml(markdown);

  const syncScroll = useCallback((sourceElement, targetElement) => {
    if (isScrollingRef.current || !sourceElement || !targetElement) return;
    
    isScrollingRef.current = true;
    
    try {
      const sourceScrollTop = sourceElement.scrollTop;
      const sourceScrollHeight = sourceElement.scrollHeight - sourceElement.clientHeight;
      
      if (sourceScrollHeight <= 0) {
        isScrollingRef.current = false;
        return;
      }
      
      const scrollPercent = sourceScrollTop / sourceScrollHeight;
      
      const targetScrollHeight = targetElement.scrollHeight - targetElement.clientHeight;
      const targetScrollTop = scrollPercent * targetScrollHeight;
      if (targetScrollHeight > 0) {
        targetElement.scrollTop = targetScrollTop;
      }
    } catch (error) {
      console.error('Scroll sync error:', error);
    }
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current);
    }
    
    syncTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 150);
  }, []);

  // Set up scroll synchronization
  useEffect(() => {
    const editor = editorRef?.current;
    const preview = previewRef.current;
    
    if (!editor || !preview) return;

    const handleEditorScroll = () => {
      if (!isScrollingRef.current) {
        syncScroll(editor, preview);
      }
    };
    
    const handlePreviewScroll = () => {
      if (!isScrollingRef.current) {
        syncScroll(preview, editor);
      }
    };

    // Add scroll event listeners
    editor.addEventListener('scroll', handleEditorScroll, { passive: true });
    preview.addEventListener('scroll', handlePreviewScroll, { passive: true });

    // Cleanup function
    return () => {
      editor.removeEventListener('scroll', handleEditorScroll);
      preview.removeEventListener('scroll', handlePreviewScroll);
      
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
    };
  }, [syncScroll, editorRef]);

  // Handle clicks on links in preview (open in new tab)
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;

    const handleLinkClick = (event) => {
      const target = event.target;
      if (target.tagName === 'A' && target.href) {
        event.preventDefault();
        
        if (target.href.startsWith('http://') || target.href.startsWith('https://')) {
          window.open(target.href, '_blank', 'noopener,noreferrer');
        } else if (target.href.startsWith('#')) {
          const anchor = target.href.substring(target.href.indexOf('#'));
          const element = preview.querySelector(`[id="${anchor.substring(1)}"]`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }
      }
    };

    preview.addEventListener('click', handleLinkClick);
    
    return () => {
      preview.removeEventListener('click', handleLinkClick);
    };
  }, [html]);

  // Auto-scroll to bottom when content is added (optional feature)
  const shouldAutoScroll = useRef(false);
  
  useEffect(() => {
    const preview = previewRef.current;
    if (!preview) return;
    
    // Check if user was at the bottom before content update
    const wasAtBottom = preview.scrollTop + preview.clientHeight >= preview.scrollHeight - 10;
    
    if (wasAtBottom && shouldAutoScroll.current) {
      setTimeout(() => {
        preview.scrollTop = preview.scrollHeight;
      }, 0);
    }
    
    shouldAutoScroll.current = true;
  }, [html]);

  return (
    <div
      ref={previewRef}
      className="preview"
      dangerouslySetInnerHTML={{ __html: html }}
      role="region"
      aria-label="Markdown preview"
      tabIndex={0}
    />
  );
};

export default SyncedPreview;