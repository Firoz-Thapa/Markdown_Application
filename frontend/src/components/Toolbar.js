import React, { useState } from 'react';
import './Toolbar.css';

function EnhancedToolbar({ applyFormatting, markdown, setMarkdown }) {
  const [showTableModal, setShowTableModal] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);

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
      
      {/* New buttons */}
      <button onClick={() => setShowTableModal(true)} title="Insert Table">📊 Table</button>
      <button onClick={insertHorizontalRule} title="Horizontal Rule">— HR</button>
      
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