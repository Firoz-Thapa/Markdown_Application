import React from 'react';
import './DocumentStats.css'; 

const DocumentStats = ({ markdown }) => {
  const calculateStats = (text) => {
    if (!text) return { words: 0, characters: 0, charactersNoSpaces: 0, paragraphs: 0, readingTime: 0 };
    
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, '').length;
    const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length;
    const readingTime = Math.ceil(words / 200); // Average 200 words per minute
    
    return { words, characters, charactersNoSpaces, paragraphs, readingTime };
  };

  const stats = calculateStats(markdown);

  return (
    <div className="document-stats">
      <div className="stats-item">
        <span className="stats-label">Words:</span>
        <span className="stats-value">{stats.words.toLocaleString()}</span>
      </div>
      <div className="stats-item">
        <span className="stats-label">Characters:</span>
        <span className="stats-value">{stats.characters.toLocaleString()}</span>
      </div>
      <div className="stats-item">
        <span className="stats-label">Paragraphs:</span>
        <span className="stats-value">{stats.paragraphs}</span>
      </div>
      <div className="stats-item">
        <span className="stats-label">Reading time:</span>
        <span className="stats-value">{stats.readingTime} min</span>
      </div>
    </div>
  );
};

export default DocumentStats;