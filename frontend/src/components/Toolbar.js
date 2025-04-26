import React from 'react';
import './Toolbar.css';

function Toolbar({ applyFormatting }) {
  return (
    <div className="toolbar">
      <button onClick={() => applyFormatting('bold')} title="Bold"><b>B</b></button>
      <button onClick={() => applyFormatting('italic')} title="Italic"><i>I</i></button>
      <button onClick={() => applyFormatting('heading')} title="Heading">H</button>
      <button onClick={() => applyFormatting('quote')} title="Blockquote">&quot;</button>
      <button onClick={() => applyFormatting('strikethrough')} title="Strikethrough"><s>S</s></button> {/* Strikethrough button */}
      <button onClick={() => applyFormatting('code')} title="Code">C</button>
      <button onClick={() => applyFormatting('ulist')} title="Unordered List">UL</button>
      <button onClick={() => applyFormatting('olist')} title="Ordered List">OL</button>
      <button onClick={() => applyFormatting('link')} title="Link">🔗</button>
      <button onClick={() => applyFormatting('image')} title="Image">🖼️</button>
    </div>
  );
}

export default Toolbar;
