import React, { useEffect, useRef, useImperativeHandle, forwardRef, useCallback } from 'react';
import { EditorView, keymap, lineNumbers, highlightActiveLine, dropCursor, rectangularSelection, crosshairCursor } from '@codemirror/view';
import { EditorState, Compartment } from '@codemirror/state';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';

const EnhancedEditor = forwardRef(({ markdown: markdownContent, onChange, isDarkMode }, ref) => {
  const editorRef = useRef(null);
  const viewRef = useRef(null);
  const containerRef = useRef(null);
  const themeCompartment = useRef(new Compartment());

  // Memoize onChange to prevent unnecessary re-renders
  const memoizedOnChange = useCallback((content) => {
    onChange({ target: { value: content } });
  }, [onChange]);

  // Expose editor methods to parent component
  useImperativeHandle(ref, () => ({
    getSelection: () => {
      if (!viewRef.current) return { start: 0, end: 0, selectedText: '' };
      const { from, to } = viewRef.current.state.selection.main;
      return {
        start: from,
        end: to,
        selectedText: viewRef.current.state.doc.sliceString(from, to)
      };
    },
    insertText: (text, position) => {
      if (!viewRef.current) return;
      const pos = position !== undefined ? position : viewRef.current.state.selection.main.from;
      const transaction = viewRef.current.state.update({
        changes: { from: pos, insert: text }
      });
      viewRef.current.dispatch(transaction);
    },
    replaceSelection: (text) => {
      if (!viewRef.current) return;
      const { from, to } = viewRef.current.state.selection.main;
      const transaction = viewRef.current.state.update({
        changes: { from, to, insert: text },
        selection: { anchor: from + text.length }
      });
      viewRef.current.dispatch(transaction);
    },
    focus: () => {
      if (viewRef.current) {
        viewRef.current.focus();
      }
    },
    getEditor: () => viewRef.current
  }));

  // Create editor only once
  useEffect(() => {
    if (!containerRef.current || viewRef.current) return;

    // Custom keymap for markdown shortcuts
    const markdownKeymap = keymap.of([
      {
        key: 'Tab',
        run: ({ state, dispatch }) => {
          const selection = state.selection.main;
          dispatch(state.update({
            changes: { from: selection.from, to: selection.to, insert: '  ' },
            selection: { anchor: selection.from + 2 }
          }));
          return true;
        }
      },
      {
        key: 'Ctrl-b',
        mac: 'Cmd-b',
        run: () => {
          if (!viewRef.current) return false;
          const selection = viewRef.current.state.selection.main;
          const selectedText = viewRef.current.state.doc.sliceString(selection.from, selection.to);
          const boldText = `**${selectedText}**`;
          
          const transaction = viewRef.current.state.update({
            changes: { from: selection.from, to: selection.to, insert: boldText },
            selection: { anchor: selection.from + 2, head: selection.from + 2 + selectedText.length }
          });
          
          viewRef.current.dispatch(transaction);
          return true;
        }
      },
      {
        key: 'Ctrl-i',
        mac: 'Cmd-i',
        run: () => {
          if (!viewRef.current) return false;
          const selection = viewRef.current.state.selection.main;
          const selectedText = viewRef.current.state.doc.sliceString(selection.from, selection.to);
          const italicText = `*${selectedText}*`;
          
          const transaction = viewRef.current.state.update({
            changes: { from: selection.from, to: selection.to, insert: italicText },
            selection: { anchor: selection.from + 1, head: selection.from + 1 + selectedText.length }
          });
          
          viewRef.current.dispatch(transaction);
          return true;
        }
      },
      {
        key: 'Ctrl-k',
        mac: 'Cmd-k',
        run: () => {
          if (!viewRef.current) return false;
          const selection = viewRef.current.state.selection.main;
          const selectedText = viewRef.current.state.doc.sliceString(selection.from, selection.to);
          const linkText = `[${selectedText || 'Link Text'}](url)`;
          
          const transaction = viewRef.current.state.update({
            changes: { from: selection.from, to: selection.to, insert: linkText },
            selection: { 
              anchor: selection.from + linkText.length - 4, 
              head: selection.from + linkText.length - 1 
            }
          });
          
          viewRef.current.dispatch(transaction);
          return true;
        }
      }
    ]);

    // Basic editor extensions
    const basicExtensions = [
      lineNumbers(),
      highlightActiveLine(),
      dropCursor(),
      rectangularSelection(),
      crosshairCursor(),
      markdown(),
      markdownKeymap,
      EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const content = update.state.doc.toString();
          memoizedOnChange(content);
        }
      }),
      EditorView.theme({
        '&': {
          height: '100%',
          fontSize: '14px',
          fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', 'source-code-pro', monospace"
        },
        '.cm-content': {
          padding: '16px',
          minHeight: '100%',
          lineHeight: '1.6'
        },
        '.cm-focused': {
          outline: 'none'
        },
        '.cm-editor': {
          height: '100%'
        },
        '.cm-scroller': {
          height: '100%',
          overflow: 'auto'
        },
        // Markdown-specific styling
        '.cm-line': {
          lineHeight: '1.6'
        }
      }),
      themeCompartment.current.of(isDarkMode ? oneDark : [])
    ];

    // Create editor state
    const state = EditorState.create({
      doc: markdownContent || '',
      extensions: basicExtensions
    });

    // Create editor view
    const view = new EditorView({
      state,
      parent: containerRef.current
    });

    viewRef.current = view;
    editorRef.current = view.dom;

    // Cleanup function
    return () => {
      if (view) {
        view.destroy();
        viewRef.current = null;
      }
    };
  }, []); // Empty dependency array - only run once

  // Update theme when isDarkMode changes
  useEffect(() => {
    if (viewRef.current && themeCompartment.current) {
      viewRef.current.dispatch({
        effects: themeCompartment.current.reconfigure(isDarkMode ? oneDark : [])
      });
    }
  }, [isDarkMode]);

  // Update content when markdownContent prop changes (but not during typing)
  useEffect(() => {
    if (viewRef.current && markdownContent !== viewRef.current.state.doc.toString()) {
      const transaction = viewRef.current.state.update({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: markdownContent || ''
        }
      });
      viewRef.current.dispatch(transaction);
    }
  }, [markdownContent]);

  return (
    <div 
      ref={containerRef} 
      style={{ 
        height: '100%', 
        width: '100%',
        border: '1px solid #ddd',
        borderRadius: '4px',
        overflow: 'hidden'
      }}
      className="enhanced-editor"
    />
  );
});

EnhancedEditor.displayName = 'EnhancedEditor';

export default EnhancedEditor;