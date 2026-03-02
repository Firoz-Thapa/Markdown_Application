import { useState, useEffect, useRef, useCallback } from 'react';
import EnhancedEditor from './components/EnhancedEditor';
import SyncedPreview from './components/SyncedPreview';
import Navbar from './components/Navbar';
import EnhancedToolbar from './components/Toolbar'; 
import Popup from './components/Popup';
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
  const [showRecoveryDialog, setShowRecoveryDialog] = useState(false);
  const [activeView, setActiveView] = useState('editor');
  const [simpleLineBreaks, setSimpleLineBreaks] = useState(true);
  
  const editorRef = useRef(null);

  // Auto-save functionality - now returns status
  const saveStatus = useAutoSave(markdown);

  // Initialize Showdown converter - will be updated based on line break mode
  const getConverter = useCallback(() => {
    return new showdown.Converter({ 
      tables: true, 
      strikethrough: true,
      simpleLineBreaks: simpleLineBreaks,
      headerLevelStart: 1,
      ghCodeBlocks: true,
      tasklists: true,
      smartIndentationFix: true
    });
  }, [simpleLineBreaks]);

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
  }, [saveFile]);

  const handleEditorChange = useCallback((event) => {
    setMarkdown(event.target.value);
  }, []);

  const handleLineBreakModeChange = useCallback((newMode) => {
    setSimpleLineBreaks(newMode);
  }, []);

  const applyFormatting = (type) => {
    if (!editorRef.current) return;
    
    const sel = editorRef.current.getSelection();
    const selectedText = sel.selectedText;

    const handlePopupConfirm = (data) => {
      let formattedText = '';

      if (data.type === 'link') {
        const displayText = data.text || selectedText || 'Link Text';
        formattedText = `[${displayText}](${data.url})`;
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
      let cursorOffset;

      switch (type) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          cursorOffset = selectedText ? formattedText.length : 2;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          cursorOffset = selectedText ? formattedText.length : 1;
          break;
        case 'heading':
          formattedText = `# ${selectedText}`;
          cursorOffset = formattedText.length;
          break;
        case 'quote':
          formattedText = selectedText.split('\n').map(line => `> ${line}`).join('\n');
          cursorOffset = formattedText.length;
          break;
        case 'code':
          if (selectedText.includes('\n')) {
            formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
            cursorOffset = selectedText ? formattedText.length : 4;
          } else {
            formattedText = `\`${selectedText}\``;
            cursorOffset = selectedText ? formattedText.length : 1;
          }
          break;
        case 'ulist':
          formattedText = `- ${selectedText}`;
          cursorOffset = formattedText.length;
          break;
        case 'olist':
          formattedText = `1. ${selectedText}`;
          cursorOffset = formattedText.length;
          break;
        case 'strikethrough':
          formattedText = `~~${selectedText}~~`;
          cursorOffset = selectedText ? formattedText.length : 2;
          break;
        default:
          break;
      }

      editorRef.current.replaceSelection(formattedText, cursorOffset);
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
    const converter = getConverter();
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
        saveStatus={saveStatus}
      />
      
      <EnhancedToolbar 
        applyFormatting={applyFormatting} 
        markdown={markdown}
        setMarkdown={setMarkdown}
        editorRef={editorRef}
        onLineBreakModeChange={handleLineBreakModeChange}
        simpleLineBreaks={simpleLineBreaks}
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
            converter={getConverter()} 
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
      

    </div>
  );
}

export default App;