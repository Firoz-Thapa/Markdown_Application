import React from 'react';
import './Navbar.css';

function Navbar({ newFile, openFile, saveFile, exportToPDF, exportToHTML, toggleDarkMode, isDarkMode, askai }) {
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
        <li><button onClick={saveFile}>Save</button></li>
        <li><button onClick={exportToPDF}>Export to PDF</button></li>
        <li><button onClick={exportToHTML}>Export to HTML</button></li>
        <li><button onClick={toggleDarkMode}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button></li>
        
      </ul>
    </nav>
  );
}

export default Navbar;

