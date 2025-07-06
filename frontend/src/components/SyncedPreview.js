import React, { useEffect, useRef, useCallback } from 'react';
import mathJaxManager from '../utils/mathUtils';

const SyncedPreview = ({ markdown, converter, editorRef }) => {
  const previewRef = useRef(null);
  const isScrollingRef = useRef(false);
  const syncTimeoutRef = useRef(null);
  const renderTimeoutRef = useRef(null);

  const html = converter.makeHtml(markdown);

  // Sync scroll between editor and preview
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

  // Render MathJax when content changes
  useEffect(() => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }

    renderTimeoutRef.current = setTimeout(async () => {
      if (previewRef.current && mathJaxManager.containsMath(markdown)) {
        try {
          await mathJaxManager.renderMath(previewRef.current);
        } catch (error) {
          console.error('MathJax rendering failed:', error);
        }
      }
    }, 300); // Debounce to avoid excessive re-rendering

    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [html, markdown]);

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

    editor.addEventListener('scroll', handleEditorScroll, { passive: true });
    preview.addEventListener('scroll', handlePreviewScroll, { passive: true });

    return () => {
      editor.removeEventListener('scroll', handleEditorScroll);
      preview.removeEventListener('scroll', handlePreviewScroll);
      
      if (syncTimeoutRef.current) {
        clearTimeout(syncTimeoutRef.current);
      }
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [syncScroll, editorRef]);

  // Handle clicks on links in preview
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

  return (
    <div
      ref={previewRef}
      className="preview tex2jax_process"
      dangerouslySetInnerHTML={{ __html: html }}
      role="region"
      aria-label="Markdown preview with math support"
      tabIndex={0}
    />
  );
};

export default SyncedPreview;