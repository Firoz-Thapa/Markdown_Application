import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

function Navbar({ newFile, openFile, saveFile, exportToPDF, exportToHTML, toggleDarkMode, isDarkMode }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar">
      <div className="navbar-brand">Markdown Tool</div>
      <ul className="navbar-menu">
        <li><button onClick={newFile}>New</button></li>
        <li>
          <input
            type="file"
            accept=".md"
            id="file-upload"
            style={{ display: 'none' }}
            onChange={openFile}
          />
          <label htmlFor="file-upload">Open</label>
        </li>
        <li>
          <div className="dropdown" ref={dropdownRef}>
            <button onClick={() => setShowDropdown(!showDropdown)}>
              Save ▼
            </button>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-item" onClick={() => {
                  saveFile();
                  setShowDropdown(false);
                }}>
                  Save as Markdown
                </div>
                <div className="dropdown-item" onClick={() => {
                  exportToPDF();
                  setShowDropdown(false);
                }}>
                  Export to PDF
                </div>
                <div className="dropdown-item" onClick={() => {
                  exportToHTML();
                  setShowDropdown(false);
                }}>
                  Export to HTML
                </div>
              </div>
            )}
          </div>
        </li>
        <li>
          <button onClick={toggleDarkMode}>
            {isDarkMode ? '☀️' : '🌙'}
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;