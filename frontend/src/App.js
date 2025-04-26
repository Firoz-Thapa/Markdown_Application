import React, { useState, useEffect } from 'react';
import Editor from './components/Editor';
import Preview from './components/Preview';
import Navbar from './components/Navbar';
import Toolbar from './components/Toolbar';
import Popup from './components/Popup';
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

  // Initialize Showdown converter with tables and strikethrough enabled
  const converter = new showdown.Converter({ tables: true, strikethrough: true });

  useEffect(() => {
    // Apply dark mode class to the body element
    document.body.className = isDarkMode ? 'dark-mode' : '';
  }, [isDarkMode]);

  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.addEventListener('keydown', handleKeyDown);
      return () => {
        textarea.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [markdown]);

  const handleEditorChange = (event) => {
    setMarkdown(event.target.value);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      const textarea = event.target;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selectedText = textarea.value.substring(start, end);
      const beforeCursor = textarea.value.substring(0, start);
      const afterCursor = textarea.value.substring(end);

      const lastLine = beforeCursor.split('\n').pop();
      const unorderedListMatch = lastLine.match(/^(\s*[-*+]\s)/);
      const orderedListMatch = lastLine.match(/^(\s*\d+\.\s)/);

      if (unorderedListMatch) {
        event.preventDefault();
        const newText = beforeCursor + '\n' + unorderedListMatch[1] + selectedText + afterCursor;
        setMarkdown(newText);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + unorderedListMatch[1].length + 1;
        }, 0);
      } else if (orderedListMatch) {
        event.preventDefault();
        const number = parseInt(orderedListMatch[1], 10) + 1;
        const newText = beforeCursor + '\n' + number + '. ' + selectedText + afterCursor;
        setMarkdown(newText);
        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + number.toString().length + 3;
        }, 0);
      }
    }
  };

  const applyFormatting = (type) => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    const handlePopupConfirm = (data) => {
      let formattedText = '';
      let cursorOffset = 0;

      if (data.type === 'link') {
        formattedText = `[${data.text || 'Link Text'}](${data.url})`;
        cursorOffset = data.text ? 0 : 10;
      } else if (data.type === 'image') {
        formattedText = `![${data.altText || 'Alt Text'}](${data.url})`;
        cursorOffset = data.altText ? 0 : 9;
      }

      const newMarkdown = markdown.substring(0, start) + formattedText + markdown.substring(end);
      setMarkdown(newMarkdown);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + selectedText.length);
      }, 0);
    };

    if (type === 'link' || type === 'image') {
      setPopupType(type);
      setPopupConfirm(() => handlePopupConfirm); 
      setIsPopupVisible(true);
    } else {
 
      let formattedText = '';
      let cursorOffset = 0;

      switch (type) {
        case 'bold':
          formattedText = `**${selectedText}**`;
          cursorOffset = 2;
          break;
        case 'italic':
          formattedText = `*${selectedText}*`;
          cursorOffset = 1;
          break;
        case 'heading':
          formattedText = `# ${selectedText}`;
          cursorOffset = 2;
          break;
        case 'quote':
          formattedText = selectedText.split('\n').map(line => `> ${line}`).join('\n');
          cursorOffset = 2;
          break;
        case 'code':
          if (selectedText.includes('\n')) {
            formattedText = `\`\`\`\n${selectedText}\n\`\`\``;
            cursorOffset = 3;
          } else {
            formattedText = `\`${selectedText}\``;
            cursorOffset = 1;
          }
          break;
        case 'ulist':
          formattedText = `- ${selectedText}`;
          cursorOffset = 2;
          break;
        case 'olist':
          formattedText = `1. ${selectedText}`;
          cursorOffset = 3;
          break;
        case 'strikethrough':
          formattedText = `~~${selectedText}~~`;
          cursorOffset = 2;
          break;
        default:
          break;
      }

      const newMarkdown = markdown.substring(0, start) + formattedText + markdown.substring(end);
      setMarkdown(newMarkdown);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + cursorOffset, start + cursorOffset + selectedText.length);
      }, 0);
    }
  };

  const newFile = () => {
    setMarkdown(''); 
  };

  const openFile = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      setMarkdown(e.target.result);
    };
    reader.readAsText(file);
  };

  const saveFile = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    saveAs(blob, 'document.md');
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

  return (
    <div className={`app ${isDarkMode ? 'dark-mode' : ''}`}>
      <Navbar
        newFile={newFile}
        openFile={openFile}
        saveFile={saveFile}
        exportToPDF={() => exportToPDF(markdown)} // Use the imported function
        exportToHTML={exportToHTML}
        toggleDarkMode={toggleDarkMode}
        isDarkMode={isDarkMode}
      />
      <Toolbar applyFormatting={applyFormatting} />
      <div className="container">
        <Editor markdown={markdown} onChange={handleEditorChange} />
        <Preview markdown={markdown} converter={converter} />
      </div>
      <Popup
        isVisible={isPopupVisible}
        type={popupType}
        onClose={handlePopupClose}
        onConfirm={popupConfirm}
      />
    </div>
  );
}

export default App;
