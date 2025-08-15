import React, { useState, useEffect, useRef, useCallback } from 'react';
import EnhancedEditor from './components/EnhancedEditor'; // Updated import
import SyncedPreview from './components/SyncedPreview';
import Navbar from './components/Navbar';
import EnhancedToolbar from './components/Toolbar'; 
import Popup from './components/Popup';
import Chatbot from './components/Chatbot';
import DocumentStats from './components/DocumentStats';
import { useAutoSave, recoverAutoSave, clearAutoSave } from './hooks/useAutoSave';
import mathJaxManager from './utils/mathUtils';
import { saveAs } from 'file-saver';
import { exportToPDF } from './pdfUtils'; 
import showdown from 'showdown';
import './App.css';

function App() {
  const [markdown, setMarkdown] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [popupType, setPopupType] = useState('');
  const [popupConfirm, setPopupConfirm] = useState(() => () => {});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [activeView, setActiveView] = useState('editor'); // For mobile tabs
  
  const editorRef = useRef(null);

  // Auto-save functionality
  useAutoSave(markdown);

  // Initialize Showdown converter with tables and strikethrough enabled
  const converter = new showdown.Converter({ tables: true, strikethrough: true });

  // Load MathJax on component mount
  useEffect(() => {
    mathJaxManager.loadMathJax().catch(error => {
      console.error('Failed to load MathJax:', error);
    });
  }, []);

  // Check for auto-saved content on mount
  useEffect(() => {
    const recovered = recoverAutoSave();
    if (recovered && recovered.content.trim()) {
      setShowRecoveryDialog(true);
    }
  }, []);

  useEffect(() => {
    // Apply dark mode class to the body element
    document.body.className = isDarkMode ? 'dark-mode' : '';
  }, [isDarkMode]);

  // Memoize saveFile function to prevent it from changing on every render
  const saveFile = useCallback(() => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, 'document.md');
    clearAutoSave();
  }, [markdown]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event) => {
      // Ctrl/Cmd + S for save
      if ((event.ctrlKey || event.metaKey) && event.key === 's') {
        event.preventDefault();
        saveFile();
      }
      
      // Escape to close dialogs
      if (event.key === 'Escape') {
        setShowRecoveryDialog(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveFile]); // Now includes saveFile dependency

  const handleEditorChange = useCallback((event) => {
    setMarkdown(event.target.value);
  }, []);

  const applyFormatting = (type) => {
    if (!editorRef.current) return;
    
    const selection = editorRef.current.getSelection();
    const selectedText = selection.selectedText;

    const handlePopupConfirm = (data) => {
      let formattedText = '';

      if (data.type === 'link') {
        formattedText = `[${data.text || selectedText || 'Link Text'}](${data.url})`;
      } else if (data.type === 'image') {
        formattedText = `![${data.altText || 'Alt Text'}](${data.url})`;
      }

      editorRef.current.replaceSelection(formattedText);
      editorRef.current.focus();
    };

    if (type === 'link' || type === 'image') {
      setPopupType(type);
      setPopupConfirm(() => handlePopupConfirm); 
      setIsPopupVisible(true);
    } else {
      let formattedText = '';

      switch (type) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          break;
        case 'heading':
          formattedText = `# ${selectedText}`;
          break;
        case 'quote':
          formattedText = selectedText.split('\n').map(line => `> ${line}`).join('\n');
          break;
        case 'code':
          if (selectedText.includes('\n')) {
            formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
          } else {
            formattedText = `\`${selectedText}\``;
          }
          break;
        case 'ulist':
          formattedText = `- ${selectedText}`;
          break;
        case 'olist':
          formattedText = `1. ${selectedText}`;
          break;
        case 'strikethrough':
          formattedText = `~~${selectedText}~~`;
          break;
        default:
          break;
      }

      editorRef.current.replaceSelection(formattedText);
      editorRef.current.focus();
    }
  };

  const newFile = () => {
    setMarkdown('');
    clearAutoSave();
  };

  const openFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      setMarkdown(e.target.result);
      clearAutoSave();
    };
    reader.readAsText(file);
  };

  const exportToHTML = () => {
    const html = converter.makeHtml(markdown);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    saveAs(blob, 'document.html');
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
  };

  const recoverDocument = () => {
    const recovered = recoverAutoSave();
    if (recovered) {
      setMarkdown(recovered.content);
    }
    setShowRecoveryDialog(false);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar
        newFile={newFile}
        openFile={openFile}
        saveFile={saveFile}
        exportToPDF={() => exportToPDF(markdown)}
        exportToHTML={exportToHTML}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      
      <EnhancedToolbar 
        applyFormatting={applyFormatting} 
        markdown={markdown}
        setMarkdown={setMarkdown}
        editorRef={editorRef}
      />
      
      {/* Mobile view toggle */}
      <div className="view-toggle">
        <button 
          className={activeView === 'editor' ? 'active' : ''} 
          onClick={() => setActiveView('editor')}
        >
          Editor
        </button>
        <button 
          className={activeView === 'preview' ? 'active' : ''} 
          onClick={() => setActiveView('preview')}
        >
          Preview
        </button>
      </div>
      
      <div className="container">
        <div className={`editor-view ${activeView === 'editor' ? 'active' : ''}`}>
          <EnhancedEditor 
            ref={editorRef}
            markdown={markdown} 
            onChange={handleEditorChange}
            isDarkMode={isDarkMode}
          />
        </div>
        <div className={`preview-view ${activeView === 'preview' ? 'active' : ''}`}>
          <SyncedPreview 
            markdown={markdown} 
            converter={converter} 
            editorRef={editorRef}
          />
        </div>
      </div>
      
      <DocumentStats markdown={markdown} />
      
      <Popup
        isVisible={isPopupVisible}
        type={popupType}
        onClose={handlePopupClose}
        onConfirm={popupConfirm}
      />
      
      {/* Recovery Dialog */}
      {showRecoveryDialog && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Recover Auto-saved Content?</h3>
            <p>We found auto-saved content from a previous session. Would you like to recover it?</p>
            <div className="popup-actions">
              <button className="popup-confirm" onClick={recoverDocument}>
                Recover
              </button>
              <button className="popup-cancel" onClick={() => setShowRecoveryDialog(false)}>
                Discard
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Chat Toggle Button */}
      <button 
        className="chat-toggle-btn" 
        onClick={() => setIsChatOpen(!isChatOpen)}
      >
        💬
      </button>
      
      {/* Chatbot Component */}
      <Chatbot 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />
    </div>
  );
}

export default App;