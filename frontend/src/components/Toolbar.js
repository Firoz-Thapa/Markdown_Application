import React, { useState } from 'react';
import './Toolbar.css';

function EnhancedToolbar({ applyFormatting, markdown, setMarkdown }) {
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  
  // Math functionality
  const [showMathDropdown, setShowMathDropdown] = useState(false);
  const [showMathModal, setShowMathModal] = useState(false);
  const [mathInput, setMathInput] = useState('');
  const [mathType, setMathType] = useState('inline');

  const insertTable = () => {
    let table = '';
    
    // Header row
    table += '| ';
    for (let i = 0; i < tableCols; i++) {
      table += `Header ${i + 1} | `;
    }
    table += '\n';
    
    // Separator row
    table += '| ';
    for (let i = 0; i < tableCols; i++) {
      table += '--- | ';
    }
    table += '\n';
    
    // Data rows
    for (let i = 0; i < tableRows; i++) {
      table += '| ';
      for (let j = 0; j < tableCols; j++) {
        table += `Cell ${i + 1}-${j + 1} | `;
      }
      table += '\n';
    }
    
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const newMarkdown = markdown.substring(0, start) + table + markdown.substring(start);
    setMarkdown(newMarkdown);
    setShowTableModal(false);
  };

  const insertHorizontalRule = () => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const newMarkdown = markdown.substring(0, start) + '\n---\n' + markdown.substring(start);
    setMarkdown(newMarkdown);
  };

  const insertCheckbox = () => {
    const textarea = document.querySelector('textarea');
    const start = textarea.selectionStart;
    const selectedText = textarea.value.substring(textarea.selectionStart, textarea.selectionEnd);
    const newMarkdown = markdown.substring(0, start) + `- [ ] ${selectedText}` + markdown.substring(textarea.selectionEnd);
    setMarkdown(newMarkdown);
  };

  // Math functions
  const insertMathEquation = (equation, isInline = true) => {
    const textarea = document.querySelector('textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    
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

  const mathExamples = {
    inline: {
      basic: 'x = y + z',
      fraction: '\\frac{a}{b}',
      superscript: 'x^2',
      subscript: 'a_i',
      greek: '\\alpha + \\beta = \\gamma'
    },
    display: {
      quadratic: '\\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}',
      integral: '\\int_{a}^{b} f(x) dx',
      summation: '\\sum_{i=1}^{n} x_i',
      matrix: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}',
      limit: '\\lim_{x \\to \\infty} \\frac{1}{x} = 0'
    }
  };

  return (
    <div className="toolbar">
      {/* Existing buttons */}
      <button onClick={() => applyFormatting('bold')} title="Bold"><b>B</b></button>
      <button onClick={() => applyFormatting('italic')} title="Italic"><i>I</i></button>
      <button onClick={() => applyFormatting('heading')} title="Heading">H</button>
      <button onClick={() => applyFormatting('quote')} title="Blockquote">&quot;</button>
      <button onClick={() => applyFormatting('strikethrough')} title="Strikethrough"><s>S</s></button>
      <button onClick={() => applyFormatting('code')} title="Code">C</button>
      
      <div className="toolbar-separator">|</div>
      
      {/* List buttons */}
      <button onClick={() => applyFormatting('ulist')} title="Unordered List">• UL</button>
      <button onClick={() => applyFormatting('olist')} title="Ordered List">1. OL</button>
      <button onClick={insertCheckbox} title="Checkbox">☑ Task</button>
      
      <div className="toolbar-separator">|</div>
      
      {/* Media buttons */}
      <button onClick={() => applyFormatting('link')} title="Link">🔗</button>
      <button onClick={() => applyFormatting('image')} title="Image">🖼️</button>
      
      <div className="toolbar-separator">|</div>
      
      {/* Math Toolbar */}
      <div className="dropdown math-toolbar">
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
                  onClick={() => insertMathEquation(equation, true)}
                  className="math-example"
                >
                  ${equation}$
                </button>
              ))}
            </div>

            <div className="math-section">
              <h4>Display Math</h4>
              {Object.entries(mathExamples.display).map(([key, equation]) => (
                <button 
                  key={key}
                  onClick={() => insertMathEquation(equation, false)}
                  className="math-example"
                >
                  $${equation.substring(0, 20)}...$
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <div className="toolbar-separator">|</div>
      
      {/* Other buttons */}
      <button onClick={() => setShowTableModal(true)} title="Insert Table">📊 Table</button>
      <button onClick={insertHorizontalRule} title="Horizontal Rule">— HR</button>
      
      {/* Math Modal */}
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
      
      {/* Table Modal */}
      {showTableModal && (
        <div className="table-modal">
          <div className="table-modal-content">
            <h3>Insert Table</h3>
            <label>
              Rows: 
              <input 
                type="number" 
                value={tableRows} 
                onChange={(e) => setTableRows(parseInt(e.target.value))}
                min="1"
                max="20"
              />
            </label>
            <label>
              Columns: 
              <input 
                type="number" 
                value={tableCols} 
                onChange={(e) => setTableCols(parseInt(e.target.value))}
                min="1"
                max="10"
              />
            </label>
            <div className="table-modal-actions">
              <button onClick={insertTable}>Insert</button>
              <button onClick={() => setShowTableModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default EnhancedToolbar;