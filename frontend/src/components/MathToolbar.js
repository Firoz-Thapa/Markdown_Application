import React, { useState, useRef, useEffect } from 'react';
import mathJaxManager from '../utils/mathUtils';
import './MathToolbar.css';

const MathToolbar = ({ applyFormatting, markdown, setMarkdown }) => {
  const [showMathDropdown, setShowMathDropdown] = useState(false);
  const [showMathModal, setShowMathModal] = useState(false);
  const [mathInput, setMathInput] = useState('');
  const [mathType, setMathType] = useState('inline');
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowMathDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const insertMathEquation = (equation, isInline = true) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    
    let formattedEquation;
    if (isInline) {
      formattedEquation = `$${equation}$`;
    } else {
      formattedEquation = `\n$$\n${equation}\n$$\n`;
    }

    const newMarkdown = markdown.substring(0, start) + formattedEquation + markdown.substring(end);
    setMarkdown(newMarkdown);

    // Focus back to textarea and position cursor
    setTimeout(() => {
      textarea.focus();
      const newPosition = start + formattedEquation.length;
      textarea.setSelectionRange(newPosition, newPosition);
    }, 0);

    setShowMathDropdown(false);
  };

  const insertCustomMath = () => {
    if (!mathInput.trim()) return;
    
    insertMathEquation(mathInput, mathType === 'inline');
    setMathInput('');
    setShowMathModal(false);
  };

  const mathExamples = mathJaxManager.getMathExamples();

  return (
    <div className="math-toolbar">
      {/* Math dropdown button */}
      <div className="dropdown" ref={dropdownRef}>
        <button 
          onClick={() => setShowMathDropdown(!showMathDropdown)}
          title="Insert Math Equation"
          className="math-button"
        >
          ∑ Math ▼
        </button>
        
        {showMathDropdown && (
          <div className="math-dropdown-menu">
            <div className="math-section">
              <h4>Quick Insert</h4>
              <button onClick={() => setShowMathModal(true)}>
                ✏️ Custom Equation
              </button>
            </div>

            <div className="math-section">
              <h4>Inline Math</h4>
              {Object.entries(mathExamples.inline).map(([key, equation]) => (
                <button 
                  key={key}
                  onClick={() => insertMathEquation(equation.slice(1, -1), true)}
                  className="math-example"
                >
                  {equation}
                </button>
              ))}
            </div>

            <div className="math-section">
              <h4>Display Math</h4>
              {Object.entries(mathExamples.display).map(([key, equation]) => (
                <button 
                  key={key}
                  onClick={() => insertMathEquation(equation.slice(2, -2), false)}
                  className="math-example"
                >
                  {equation.substring(0, 30)}...
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Math equation modal */}
      {showMathModal && (
        <div className="math-modal">
          <div className="math-modal-content">
            <h3>Insert Math Equation</h3>
            
            <div className="math-type-selector">
              <label>
                <input
                  type="radio"
                  value="inline"
                  checked={mathType === 'inline'}
                  onChange={(e) => setMathType(e.target.value)}
                />
                Inline Math ($...$)
              </label>
              <label>
                <input
                  type="radio"
                  value="display"
                  checked={mathType === 'display'}
                  onChange={(e) => setMathType(e.target.value)}
                />
                Display Math ($$...$$)
              </label>
            </div>

            <textarea
              value={mathInput}
              onChange={(e) => setMathInput(e.target.value)}
              placeholder="Enter LaTeX equation (e.g., x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a})"
              rows={4}
              className="math-input"
            />

            <div className="math-preview">
              <h4>Preview:</h4>
              <div className="math-preview-content">
                {mathType === 'inline' ? `$${mathInput}$` : `$$${mathInput}$$`}
              </div>
            </div>

            <div className="math-modal-actions">
              <button onClick={insertCustomMath} className="confirm-btn">
                Insert
              </button>
              <button onClick={() => setShowMathModal(false)} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MathToolbar;